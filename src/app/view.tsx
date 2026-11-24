"use client";

import { AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { MomentItem } from "@/components/moment-item";
import { route } from "@/configs/route";
import {
	Timeline,
	type TimelineNode,
	type TimelinePoint,
} from "@/features/timeline";
import { useModal } from "@/shared/providers/modal-provider";
import type { RichMoment } from "@/types/moment";
import cn from "@/shared/utils/cn";
import { HomeToolbar } from "./toolbar";

interface HomeContentProps {
	totalHeightVh: number;
	timelineNodes: TimelineNode<RichMoment>[];
	itemPositions: TimelinePoint[];
	curvePoints: TimelinePoint[];
}

export function HomeView({
	totalHeightVh,
	curvePoints,
	timelineNodes,
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
						nodes={timelineNodes}
						itemPositions={itemPositions}
						scrollContainerRef={scrollContainerRef}
						renderItem={({ data, style, yPct, currentDrawYPercent, align }) => (
							<Link href={route.moments.detail(data.id)} scroll={false}>
								<MomentItem
									moment={data}
									yPct={yPct}
									currentDrawYPercent={currentDrawYPercent}
									alight={align}
									style={style}
								/>
							</Link>
						)}
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

			<AnimatePresence>{isScrollToTimeline && <HomeToolbar />}</AnimatePresence>
		</main>
	);
}
