import type { Color } from "@/types/color";

export function getColor(color: Color) {
	switch (color) {
		case "sky":
			return "var(--color-sky-200)";
		case "blue":
			return "var(--color-blue-200)";
		case "green":
			return "var(--color-green-200)";
		case "red":
			return "var(--color-red-200)";
		case "yellow":
			return "var(--color-yellow-200)";
		case "purple":
			return "var(--color-purple-200)";
		case "pink":
			return "var(--color-pink-200)";
		case "orange":
			return "var(--color-orange-200)";
		case "beige":
			return "var(--color-amber-50)";
		default:
			return "var(--color-blue-200)"; // Default color if none matches
	}
}
