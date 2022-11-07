export const isValidUrl = (url: string) => {
	try {
		return new URL(url);
	} catch (err) {
		return "This is not a valid URL";
	}
};

export const validate = (url: string) => {
	if (url === "") return;

	const validURL = isValidUrl(url);
	if (typeof validURL == "string") return;

	const { origin, path, search, searchParams } = validURL;
	const isGFonts = origin === "https://fonts.googleapis.com";
	const isGFonts2 = path === "/css2";
	const hasSearch = search !== "";

	if (!isGFonts && !isGFonts2 && !hasSearch) return;

	const hasFonts = searchParams.getAll("family");
	if (!hasFonts) return;

	return true;
};
