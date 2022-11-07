export const download = (blob) => {
	if (process.server) return false;

	const url = window.URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", "static-g-fonts.zip");
	document.body.appendChild(link);
	link.click();
	link.parentNode.removeChild(link);

	// clean up Url
	window.URL.revokeObjectURL(url);
};
