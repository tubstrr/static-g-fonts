export const handleRange = (range, ranges) => {
	const index = ranges.indexOf(range);
	if (index === -1) {
		ranges.push(range);
		return `UR_${ranges.length - 1}`;
	}
	return `UR_${index}`;
};

export const dumpObject = (obj) => {
	return Object.entries(obj)
		.map(([key, value]) => {
			return `${key}: ${value};`;
		})
		.join(" ");
};

// Push styles to CSS & SCSS arrays
export const pushStyles = (font, fontName, CSS, SCSS) => {
	const { fontFamily, fontWeight, fontStyle, format, unicodeRange } = font;
	const fontFaceOBJ = {
		"font-family": `"${fontFamily}"`,
		"font-style": fontStyle,
		"font-weight": fontWeight,
		"font-display": "swap",
		"unicode-range": unicodeRange
	};

	fontFaceOBJ.src = `url('./fonts/${fontName}') format('${format}')`;
	CSS.push(`@font-face {${dumpObject(fontFaceOBJ)}}`);

	fontFaceOBJ.src = `url($static-g-fonts-path + '${fontName}') format('${format}')`;
	SCSS.push(`@font-face {${dumpObject(fontFaceOBJ)}}`);
};

// Generate Name
export const generateName = (font, ranges) => {
	const { fontFamily, fontStyle, fontWeight, format, unicodeRange } = font;
	const range = handleRange(unicodeRange, ranges);
	let name = `${fontFamily.toLowerCase()}-${fontStyle.charAt(0)}-${fontWeight}-${range}.${format}`;
	name = name.replace(/ /g, "-");
	name = name.replace(/--/g, "-");

	return encodeURI(name);
};
