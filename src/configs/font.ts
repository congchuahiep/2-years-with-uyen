import { Fuzzy_Bubbles, Pangolin } from "next/font/google";

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
