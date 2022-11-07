// 3rd party imports
import fetch from "node-fetch";
import AdmZip from "adm-zip";
import download from "download";

// Nuxt Imports
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { sendStream } from "h3";

// Custom imports
import * as helpers from "~/helpers/generate";
import { readme } from "~/helpers/readme";
import { validate } from "~/helpers/validate";

export default defineEventHandler(async (event) => {
	// Get URL from event
	const { url } = await readBody(event);

	// Validate URL
	const isValid = validate(url);
	if (!isValid)
		return {
			error: "Invalid URL.",
			reason:
				"The URL you provided is not a valid Google Fonts URL. https://fonts.googleapis.com is the only valid origin.",
			concern:
				"You've hit this API without the Front-end, which probably means you're trying to break this. Please don't."
		};

	// Setup temp directory
	const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "nuxt-g-fonts-"));

	// Fetch Google Fonts CSS
	const options = {
		headers: {
			"user-agent":
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
		}
	};
	const response = await fetch(url, options);
	const googleStyles = await response.text();

	// Split FontFaces into an array
	const fontFacesRegex = /@font-face\s*{[^}]*}/gm;
	const fontFaces = googleStyles.match(fontFacesRegex);

	// Unicode ranges to shorten file names
	const ranges = [];

	// Placeholder for CSS & SCSS styles
	const CSS = [];
	const SCSS = [];

	// Loop through each FontFace
	const downloadedFonts = [];
	fontFaces.forEach((fontFace, index) => {
		downloadedFonts.push(false);
		// Setup Regular Expressions
		const urlRegex = /url\(([^)]+)\)/;
		const formatRegex = /format\(\'([^)]+)\'\)/;
		const fontFamilyRegex = /font-family:\s*['"]([^'"]*)['"]/;
		const fontStyleRegex = /font-style:\s*([^;]*)/;
		const fontWeightRegex = /font-weight:\s*([^;]*)/;
		const unicodeRangeRegex = /unicode-range:\s*([^;]*)/;

		// Setup Font Object
		const font = {
			fontFamily: fontFace.match(fontFamilyRegex)[1],
			fontStyle: fontFace.match(fontStyleRegex)[1],
			fontWeight: fontFace.match(fontWeightRegex)[1],
			url: fontFace.match(urlRegex)[1],
			format: fontFace.match(formatRegex)[1],
			unicodeRange: fontFace.match(unicodeRangeRegex)[1]
		};

		const fontName = helpers.generateName(font, ranges);

		// Push styles to CSS & SCSS arrays
		helpers.pushStyles(font, fontName, CSS, SCSS);

		// Download font
		const fontPath = path.join(tempDir, "fonts");

		download(font.url, fontPath, { filename: fontName }).then(() => {
			downloadedFonts[index] = true;
		});
	});

	// Write CSS & SCSS files
	fs.writeFileSync(path.join(tempDir, "fonts.css"), CSS.join(""));
	fs.writeFileSync(path.join(tempDir, "README.md"), readme);
	fs.writeFileSync(path.join(tempDir, "fonts.scss"), "$static-g-fonts-path: './fonts/';\n\n" + SCSS.join(""));

	const checkDownloaded = () => {
		return downloadedFonts.every((font) => font === true);
	};

	const readyToSend = new Promise(() => {
		const interval = setInterval(() => {
			if (checkDownloaded()) {
				clearInterval(interval);
				console.log("sending");
				// Create ZIP file
				const fontZipPath = path.join(tempDir, "fonts.zip");
				const zip = new AdmZip();
				zip.addLocalFolder(tempDir);
				zip.writeZip(fontZipPath);
				return sendStream(event, fs.createReadStream(fontZipPath));
			}
		}, 32);
	});

	return readyToSend;
});
