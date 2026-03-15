"use client";

import { type MotionValue, motion, useTransform } from "motion/react";
import { RoughBox } from "./ui/rough-box";

interface YearIndicatorItemProps {
	year: number;
	style?: React.CSSProperties;
	yPct: number;
	currentDrawYPercent: MotionValue<number>;
}

export function YearIndicatorItem({
	year,
	style,
	yPct,
	currentDrawYPercent,
}: YearIndicatorItemProps) {
	const opacity = useTransform(currentDrawYPercent, (percent) => {
		return percent >= yPct ? 1 : 0;
	});

	const scale = useTransform(currentDrawYPercent, (percent) => {
		return percent >= yPct ? 1 : 0.5;
	});

	return (
		<motion.div
			style={{ ...style, opacity, scale }}
			className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
		>
			<RoughBox
				shape="circle"
				padding={24}
				roughConfig={{
					fill: "var(--color-rose-50)",
					stroke: "transparent",
					fillStyle: "cross-hatch",
					fillWeight: 8,
					roughness: 2,
				}}
			>
				<span className="font-display text-2xl font-bold text-amber-900">
					{year}
				</span>
			</RoughBox>
		</motion.div>
	);
}
