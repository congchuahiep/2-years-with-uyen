"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useSafeBack() {
	const router = useRouter();

	const safeBack = useCallback(() => {
		const referrer = document.referrer;
		if (referrer?.includes(window.location.hostname)) {
			router.back();
		} else {
			router.push("/");
		}
	}, [router]);

	return safeBack;
}
