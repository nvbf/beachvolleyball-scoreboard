export default function hexToRGBA(hex) {
	const rgb = hexToRgb(hex);
	return rgb ? `rgba(${rgb.r},${rgb.g},${rgb.b},.4)` : '';
}

function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

