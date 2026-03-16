"use client";

import { AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { PencilIcon } from "@/components/icon/pencil";
import { Timeline } from "@/components/timeline-curve";
import { Button } from "@/components/ui/button";
import { route } from "@/configs/route";
import { useModal } from "@/providers/modal-provider";
import type { TimelineItem, TimelinePoint } from "@/types/timeline";
import cn from "@/utils/cn";
import { motion } from "motion/react";
import { RoughTag } from "@/components/ui/rough-tag";
import { playSound } from "@/utils/audio";
import Float from "@/components/ui/float";

interface HomeContentProps {
	totalHeightVh: number;
	timelineItems: TimelineItem[];
	itemPositions: TimelinePoint[];
	curvePoints: TimelinePoint[];
}

export function HomeView({
	totalHeightVh,
	curvePoints,
	timelineItems,
	itemPositions,
}: HomeContentProps) {
	const { scrollContainerRef } = useModal();
	const { scrollY } = useScroll({ container: scrollContainerRef });
	const [isScrollToTimeline, setIsScrollToTimeline] = useState<boolean>(false);

	useMotionValueEvent(scrollY, "change", (latest) => {
		setIsScrollToTimeline(latest >= window.innerHeight);
	});

	return (
		<main className={cn("h-auto relative", isScrollToTimeline && "bg-bg")}>
			{/* Timeline thực tế, sticky để luôn hiển thị */}
			<div
				id="section-timeline"
				className="w-full max-w-3xl mx-auto h-full px-8 mb-[20vh] sticky top-0 z-0"
			>
				<div
					className="relative w-full"
					style={{ height: `${totalHeightVh}vh` }}
				>
					<Timeline
						points={curvePoints}
						items={timelineItems}
						itemPositions={itemPositions}
						roughConfig={{
							stroke: "var(--color-yellow-50)",
							strokeWidth: 4,
							roughness: 0,
						}}
					/>
				</div>
			</div>

			{/* Hero Section đóng vai trò "nắp hộp" */}
			<HeroSection className="z-10 absolute top-0 w-full" />

			{/* Spacer để tạo không gian cho hiệu ứng "mở hộp" */}
			<div className="h-screen" />

			<AnimatePresence>
				{isScrollToTimeline && (
					<Link
						href={route.moments.create}
						className={cn(
							"fixed -bottom-4 right-2 z-0",
							"active:scale-95 transition-transform ease-out drop-shadow-xl",
						)}
						onClick={() => playSound()}
					>
						<Float speed={0.2} amplitude={[10, 10, 10]}>
							<motion.div
								initial={{ y: 40, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: 40, opacity: 0 }}
								transition={{ type: "spring", duration: 0.3 }}
								className="relative"
							>
								<PencilIcon
									className="h-60 -rotate-45 mr-12"
									roughConfig={{
										fill: "var(--color-amber-300)",
										fillWeight: 3,
										fillStyle: "zigzag",
										roughness: 0.8,
									}}
								/>
								<RoughTag
									className="absolute top-16 left-12 z-10 rotate-12"
									roughConfig={{ fill: "var(--color-red-300)", roughness: 0.5 }}
								>
									Tạo kỉ niệm
								</RoughTag>
							</motion.div>
						</Float>
					</Link>
				)}
			</AnimatePresence>
		</main>
	);
}
