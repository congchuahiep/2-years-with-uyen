"use client";

import { useEffect } from "react";
import { preloadSounds } from "@/utils/audio";

export function AudioPreloader() {
	useEffect(() => {
		preloadSounds();
	}, []);

	return null;
}
