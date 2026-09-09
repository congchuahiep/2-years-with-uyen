"use client";

import { forwardRef } from "react";
import { BlankBookPage } from "../blank-book-page";

/**
 * Trang TIN NHẮN CUỐI SÁCH (trang vật lý N+1 — mặt trái của cặp trang
 * trước bìa sau). Là 1 child của `HTMLFlipBook` nên phải forwardRef.
 */
export const EndBookPage = forwardRef<
	HTMLDivElement,
	{ side?: "left" | "right" }
>(({ side = "left" }, ref) => {
	return (
		<BlankBookPage ref={ref} side={side}>
			{/* Băng keo washi trang trí */}
			<div className="absolute top-10 right-10 h-6 w-24 rotate-6 bg-green-300/70 opacity-80" />

			<span className="text-5xl drop-shadow-sm">💕</span>
			<h2 className="px-8 text-center font-display text-3xl leading-tight font-bold">
				Điều cuối sổ này muốn nói
			</h2>
			<p className="px-8 text-center text-sm font-semibold text-amber-900/80">
				Cảm ơn em vì 2 năm thật đẹp. Và chuyện của chúng ta…
				<br />
				vẫn còn dài lắm. 🦛
			</p>

			<div className="mt-1 flex items-center gap-2 rounded-full border-2 border-dashed border-red-400/60 px-5 py-1.5 text-sm font-bold text-red-500">
				Lật thêm một trang nữa nhé <span>👉</span>
			</div>
		</BlankBookPage>
	);
});

EndBookPage.displayName = "EndBookPage";
