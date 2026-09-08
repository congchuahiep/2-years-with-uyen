"use client";

import { forwardRef } from "react";
import cn from "@/utils/cn";
import { RoughBox } from "../ui/rough-box";

export const BookCover = forwardRef<
	HTMLDivElement,
	{ children?: React.ReactNode; side?: "left" | "right"; className?: string }
>((props, ref) => {
	return (
		<div
			ref={ref}
			className={cn(
				"relative flex h-full w-full flex-col items-center justify-center gap-5 rounded-md text-purple-50 perspective-distant",
				"select-none [-webkit-user-drag:none]",
				props.className,
			)}
		>
			<RoughBox
				className={cn(
					"absolute -inset-2 size-[100%+16px]",
					props.side === "right" && "left-0",
					props.side === "left" && "right-0",
				)}
				roughConfig={{
					roughness: 1,
					strokeWidth: 5,
					bowing: 2,
					fillStyle: "solid",
					stroke: "var(--color-yellow-950)",
					fill: "var(--color-rose-950)",
				}}
			/>

			{/* Khung viền nét vẽ */}
			<div className="absolute inset-6">
				<RoughBox
					className="size-full saturate-50"
					roughConfig={{
						roughness: 2,
						strokeWidth: 3,
						fillWeight: 3,
						bowing: 2,
						fillStyle: "cross-hatch",
						stroke: "var(--color-rose-400)",
						fill: "var(--color-rose-900)",
					}}
				/>
			</div>

			{props.side && (
				<div
					className={cn(
						"pointer-events-none absolute inset-y-0 w-42 z-10",
						props.side === "right"
							? "left-0 bg-linear-to-r from-black/40 to-transparent"
							: "right-0 bg-linear-to-l from-black/40 to-transparent",
					)}
				/>
			)}

			{props.children}
		</div>
	);
});

BookCover.displayName = "BookCover";
