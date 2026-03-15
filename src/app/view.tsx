"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
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
	const [reactTimeline, setReactTimeline] = useState<boolean>(false);

	useMotionValueEvent(scrollY, "change", (latest) => {
		setReactTimeline(latest >= window.innerHeight);
	});

	return (
		<main className={cn("h-auto relative", reactTimeline && "bg-bg")}>
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

			<Link href={route.moments.create} className="fixed bottom-4 right-4 z-50">
				<Button perspective="right" fill="var(--color-blue-300)">
					<PencilIcon className="scale-200 rotate-45 mr-2" />
					Tạo kỉ niệm
				</Button>
			</Link>
		</main>
	);
}
