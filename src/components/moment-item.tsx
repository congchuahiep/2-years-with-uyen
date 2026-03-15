"use client";

import { type MotionValue, motion, useTransform } from "motion/react";
import Image from "next/image";
import { useMemo } from "react";
import type { RichMoment } from "@/types/moment";
import cn from "@/utils/cn";
import { Polaroid } from "./ui/polaroid";
import { RoughBox } from "./ui/rough-box";

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	if (Number.isNaN(date.getTime())) return dateStr;
	const dd = String(date.getDate());
	const mm = String(date.getMonth() + 1);
	return `${dd}-${mm}`;
}

interface MomentItemProps {
	moment: RichMoment;
	style?: React.CSSProperties;
	alight?: "left" | "right";
	yPct: number;
	currentDrawYPercent: MotionValue<number>;
}

export function MomentItem({
	moment,
	style,
	alight,
	yPct,
	currentDrawYPercent,
}: MomentItemProps) {
	const mainImage = useMemo(
		() => moment.images.find((img) => img.isMain),
		[moment.images],
	);

	// Tính toán trạng thái opacity và y dựa trên phần trăm timeline đã được vẽ
	const opacity = useTransform(currentDrawYPercent, (percent) => {
		// Hiển thị item khi mũi nhọn vẽ vượt qua toạ độ yPct của nó
		return percent >= yPct ? 1 : 0;
	});

	const y = useTransform(currentDrawYPercent, (percent) => {
		return percent >= yPct ? 0 : 50;
	});

	return (
		<motion.div
			style={{ ...style, opacity, y }}
			className={cn(
				"absolute flex items-center justify-center z-10 hover:z-20",
				"-translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-500",
			)}
		>
			<RoughBox
				className="font-bold text-yellow-700 z-10 min-w-20 text-center"
				style={{
					rotate: `${alight === "left" ? -12 : 12}deg`,
				}}
				padding={4}
				roughConfig={{
					stroke: "transparent",
					fill: "color-mix(in srgb, var(--color-yellow-200) 94%, transparent)",
					fillStyle: "solid",
					fillWeight: 5,
					roughness: 0.5,
				}}
			>
				{formatDate(moment.event_date)}
			</RoughBox>

			<motion.div
				className="absolute top-2"
				style={{
					...(alight === "left"
						? { left: "30%", transformOrigin: "left center" }
						: { right: "30%", transformOrigin: "right center" }),
				}}
			>
				<Polaroid text={moment.title} isMini>
					{mainImage && (
						<RoughBox className="size-full">
							<Image
								src={mainImage.url}
								alt={moment.title}
								className="object-cover -z-50 pointer-events-none"
								fill
							/>
						</RoughBox>
					)}
				</Polaroid>
			</motion.div>
		</motion.div>
	);
}
