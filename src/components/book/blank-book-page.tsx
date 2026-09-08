"use client";

import { forwardRef } from "react";
import cn from "@/utils/cn";
import { RoughBox } from "../ui/rough-box";

export const BlankBookPage = forwardRef<
	HTMLDivElement,
	{ side: "left" | "right"; children?: React.ReactNode }
>(({ side, children }, ref) => {
	return (
		<div
			ref={ref}
			className={cn(
				"size-full select-none rounded-md",
				"bg-amber-50",
				"bg-[radial-gradient(circle,var(--color-purple-400)_1px,transparent_0px)]",
				"bg-size-[24px_24px]",
			)}
		>
			<RoughBox
				className={cn(
					"absolute left-1 h-full w-[calc(100%-2px)]",
				)}
				roughConfig={{
					bowing: 1,
					roughness: 2,
					stroke: "var(--color-amber-50)",
				}}
			></RoughBox>
			<div
				className={cn(
					"pointer-events-none absolute inset-y-0 w-4 z-10",
					side === "right"
						? "left-0 bg-linear-to-r from-black/30 to-transparent"
						: "right-0 bg-linear-to-l from-black/30 to-transparent",
				)}
			/>
			<div
				className={cn(
					"pointer-events-none absolute inset-y-0 w-64 z-10",
					side === "right"
						? "left-4 bg-linear-to-r via-15% from-transparent via-black/10 to-transparent"
						: "right-4 bg-linear-to-l via-15% from-transparent via-black/10 to-transparent",
				)}
			/>
			{children}
		</div>
	);
});

BlankBookPage.displayName = "BookBlankPage";
