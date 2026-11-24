"use client";

import { useEffect } from "react";
import { preloadSounds } from "@/shared/utils/audio";

export function AudioPreloaderProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		preloadSounds();
	}, []);

	return children;
}
