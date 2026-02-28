import { Fuzzy_Bubbles, Google_Sans, Pangolin } from "next/font/google";

export const googleSans = Google_Sans({
	variable: "--font-google-sans",
	subsets: ["latin"],
});

export const pangolin = Pangolin({
	subsets: ["vietnamese"],
	weight: "400",
	variable: "--font-pangolin",
});

export const fuzzyBubbles = Fuzzy_Bubbles({
	subsets: ["vietnamese"],
	weight: "400",
	variable: "--font-fuzzy-bubbles",
});
