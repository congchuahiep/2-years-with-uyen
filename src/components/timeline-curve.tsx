"use client";

import {
	type MotionValue,
	motion,
	useScroll,
	useSpring,
	useTransform,
} from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import { route } from "@/configs/route";
import { useModal } from "@/providers/modal-provider";
import type { TimelineItem, TimelinePoint } from "@/types/timeline";
import cn from "@/utils/cn";
import { MomentItem } from "./moment-item";
import { YearIndicatorItem } from "./year-indicator-item";

const STABLE_VIEWPORT_RATIO = 0.8;
const SAMPLES_PER_100VH = 200;

interface TimelineProps {
	points: TimelinePoint[];
	items: TimelineItem[];
	itemPositions: TimelinePoint[];
	className?: string;
	roughConfig?: Options;
}

export function Timeline({
	points,
	items,
	itemPositions,
	className,
	roughConfig = {},
}: TimelineProps) {
	const svgGroupRef = useRef<SVGGElement>(null);
	const placeholderGroupRef = useRef<SVGGElement>(null);
	const timelineContainerRef = useRef<HTMLDivElement>(null);
	const [isDrawn, setIsDrawn] = useState(false);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const [maskData, setMaskData] = useState({ d: "", length: 0 });
	const lookupTableRef = useRef<{ y: number; frac: number }[]>([]);

	const configStr = JSON.stringify(roughConfig);

	const { scrollContainerRef } = useModal();

	const { scrollY } = useScroll({
		container: scrollContainerRef,
	});

	// Toán học ánh xạ toạ độ cuộn thành chiều dài timeline
	const currentDrawYPercent = useTransform(scrollY, (y) => {
		if (!scrollContainerRef.current || dimensions.height === 0) return 0;
		const viewportHeight = scrollContainerRef.current.clientHeight;
		if (viewportHeight === 0) return 0;

		const yInVh = (y / viewportHeight) * 100;

		let lInVh = 0;
		if (yInVh <= 100) {
			// Giai đoạn 1 (từ 0 đến 100vh đầu): Timeline đang bị khoá (sticky).
			// Kéo dài nét vẽ từ 0 tới mốc ổn định của màn hình.
			lInVh = yInVh * STABLE_VIEWPORT_RATIO;
		} else {
			// Giai đoạn 2 (trên 100vh): Timeline đã bắt đầu trượt lên trên.
			// Muốn giữ mũi nhọn ở vị trí ổn định trên màn hình thì chiều dài vẽ phải
			// bằng "Độ trượt của Timeline" + "Khoảng cách ổn định"
			lInVh = yInVh - 100 + 100 * STABLE_VIEWPORT_RATIO;
		}

		// Tính tổng chiều cao thực tế của timeline (theo hệ vh)
		const totalHeightVh = (dimensions.height / viewportHeight) * 100;
		if (totalHeightVh === 0) return 0;

		// Trả về phần trăm (0-100) mà mũi nhọn đã vẽ tới so với tổng chiều cao
		return Math.min(100, Math.max(0, (lInVh / totalHeightVh) * 100));
	});

	const rawPathLength = useTransform(currentDrawYPercent, (percent) => {
		if (dimensions.height === 0) return 0;
		const viewportHeight = scrollContainerRef.current?.clientHeight || 1000;
		const totalHeightVh = (dimensions.height / viewportHeight) * 100;
		// lInVh hiện tại
		const lInVh = (percent / 100) * totalHeightVh;

		const targetYPx = (lInVh / 100) * viewportHeight;

		const table = lookupTableRef.current;
		if (table.length === 0) return 0;
		if (targetYPx <= table[0].y) return table[0].frac;
		if (targetYPx >= table[table.length - 1].y)
			return table[table.length - 1].frac;

		// Tìm kiếm nhị phân để tìm đoạn Y chứa targetYPx
		let low = 0;
		let high = table.length - 1;
		while (low <= high) {
			const mid = Math.floor((low + high) / 2);
			if (table[mid].y === targetYPx) {
				return table[mid].frac;
			}
			if (table[mid].y < targetYPx) {
				low = mid + 1;
			} else {
				high = mid - 1;
			}
		}

		// Nội suy tuyến tính giữa 2 điểm gần nhất để ra chính xác số lẻ
		const p1 = table[high];
		const p2 = table[low];
		if (p1 && p2 && p2.y !== p1.y) {
			const t = (targetYPx - p1.y) / (p2.y - p1.y);
			return p1.frac + t * (p2.frac - p1.frac);
		}

		return p1 ? p1.frac : 0;
	});

	// Thêm độ đàn hồi nhẹ để khi người dùng kéo cuộn sẽ êm mắt hơn
	const smoothPathLength = useSpring(rawPathLength, {
		damping: 80,
		stiffness: 600,
		bounce: 0,
	});

	// ResizeObserver: Đo đạc kích thước Container chứa SVG để scale
	// toạ độ sang Pixel thật
	useEffect(() => {
		if (!timelineContainerRef.current) return;
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect;
				// Đồng bộ đúng y hệt chiều cao thực tế của thẻ thẻ wrapper
				setDimensions({ width, height });
			}
		});
		observer.observe(timelineContainerRef.current);
		return () => observer.disconnect();
	}, []);

	// Thuật toán vẽ Đường Cong nối mốc
	useEffect(() => {
		if (
			!svgGroupRef.current ||
			dimensions.width === 0 ||
			dimensions.height === 0 ||
			points.length === 0
		)
			return;

		const parsedConfig = JSON.parse(configStr);
		const rc = rough.svg(svgGroupRef.current as unknown as SVGSVGElement);

		const options: Options = {
			roughness: 0, // Nét bút chì sứt sẹo, rung
			strokeWidth: 8, // Đường mòn khổng lồ
			stroke: "var(--color-slate-300)", // Màu bút chì xám chì đường mòn
			disableMultiStroke: true,
			...parsedConfig,
		};

		// Tự động đảo ngược điểm nếu mảng truyền vào là từ dưới lên (y giảm dần)
		// để đảm bảo pathLength luôn chạy từ trên xuống dưới theo hướng scroll
		const isBottomUp = points[0].y > points[points.length - 1].y;
		const orderedPoints = isBottomUp ? [...points].reverse() : points;

		// Scale từ tỉ lệ % X, Y sang điểm pixel tuyệt đối trên màn hình
		const absolutePoints: [number, number][] = orderedPoints.map((p) => [
			(p.x * dimensions.width) / 100, // X: % to px
			(p.y * dimensions.height) / 100, // Y: % to px
		]);

		// 1. Sinh ra path chạy ngầm một đường trơn tru để làm Mask (Rút gọn)
		const tempSvg = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"svg",
		);
		const tempRc = rough.svg(tempSvg);
		const maskNode = tempRc.curve(absolutePoints, {
			roughness: 0,
			disableMultiStroke: true,
		});

		const pathEl = maskNode.querySelector("path");
		let d = "";
		if (pathEl) {
			d = pathEl.getAttribute("d") || "";

			// --- TẠO BẢNG TRA CỨU (LOOKUP TABLE) ---
			// Lấy mẫu (sample) trên đường cong để tìm mối quan hệ giữa Toạ độ Y và % PathLength
			const totalLength = pathEl.getTotalLength();
			const samples = [];
			// Tính số lượng sample linh hoạt theo chiều cao
			const viewportHeight =
				scrollContainerRef.current?.clientHeight || window.innerHeight || 1000;
			const totalHeightVh = (dimensions.height / viewportHeight) * 100;
			const numSamples = Math.max(
				100,
				Math.ceil((totalHeightVh / 100) * SAMPLES_PER_100VH),
			);

			for (let i = 0; i <= numSamples; i++) {
				const frac = i / numSamples;
				const len = frac * totalLength;
				const pt = pathEl.getPointAtLength(len);
				samples.push({ y: pt.y, frac });
			}
			// Sắp xếp lại theo trục Y phòng trường hợp đường cong bị vểnh ngược lên nhẹ
			samples.sort((a, b) => a.y - b.y);
			lookupTableRef.current = samples;
		}

		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMaskData({ d, length: 0 });

		// Render bằng thuật toán nội suy Catmull-Rom spline curves nội tại của thư viện
		while (svgGroupRef.current.firstChild) {
			svgGroupRef.current.removeChild(svgGroupRef.current.firstChild);
		}
		if (placeholderGroupRef.current) {
			while (placeholderGroupRef.current.firstChild) {
				placeholderGroupRef.current.removeChild(
					placeholderGroupRef.current.firstChild,
				);
			}
		}

		const curveNode = rc.curve(absolutePoints, options);
		svgGroupRef.current.appendChild(curveNode);

		if (placeholderGroupRef.current) {
			const clone = curveNode.cloneNode(true);
			placeholderGroupRef.current.appendChild(clone);
		}

		if (!isDrawn) {
			requestAnimationFrame(() => setIsDrawn(true));
		}
	}, [
		configStr,
		points,
		dimensions.width,
		dimensions.height,
		isDrawn,
		scrollContainerRef,
	]);

	return (
		<div
			ref={timelineContainerRef}
			className={cn("relative size-full", className)}
		>
			<svg
				aria-hidden="true"
				width={dimensions.width}
				height={dimensions.height}
				viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
				className={cn(
					"absolute top-0 left-0 transition-opacity duration-700 w-full overflow-visible drop-shadow-lg",
					!isDrawn ? "opacity-0" : "opacity-100",
				)}
			>
				<title>timeline curve</title>
				<defs>
					<mask
						id="timeline-reveal-mask"
						maskUnits="userSpaceOnUse"
						x="-400"
						y="-400"
						width={dimensions.width + 800}
						height={dimensions.height + 800}
					>
						{/* Background trống (đen) của mask */}
						<rect
							x="-400"
							y="-400"
							width={dimensions.width + 800}
							height={dimensions.height + 800}
							fill="black"
						/>
						{/* Vùng hiện hình (trắng) vẽ dần theo cuộn trang */}
						<motion.path
							d={maskData.d}
							stroke="white"
							strokeWidth="80"
							strokeLinecap="round"
							strokeLinejoin="round"
							fill="none"
							style={{
								pathLength: smoothPathLength,
							}}
						/>
					</mask>
				</defs>

				{/* Lớp nền mờ ảo hiển thị toàn phần không bị mask */}
				<g ref={placeholderGroupRef} className="opacity-20" />
				{/* Lớp thực tế chạy dần theo scroll */}
				<g ref={svgGroupRef} mask="url(#timeline-reveal-mask)" />
			</svg>

			<TimelineMomentList
				items={items}
				positions={itemPositions}
				currentDrawYPercent={currentDrawYPercent}
			/>
		</div>
	);
}

interface TimelineMomentListProps {
	items: TimelineItem[];
	positions: TimelinePoint[];
	currentDrawYPercent: MotionValue<number>;
}

function TimelineMomentList({
	items,
	positions,
	currentDrawYPercent,
}: TimelineMomentListProps) {
	return items.map((item, index) => {
		const point = positions[index];
		if (!point) return null;

		const rotation = (index % 5) * 3 - 6;

		switch (item.type) {
			case "moment":
				return (
					<Link
						key={item.data.id}
						href={route.moments.detail(item.data.id)}
						scroll={false}
					>
						<MomentItem
							moment={item.data}
							yPct={point.y}
							currentDrawYPercent={currentDrawYPercent}
							alight={index % 2 === 0 ? "left" : "right"}
							style={{
								top: `${point.y}%`,
								left: `${point.x}%`,
								rotate: `${rotation}deg`,
							}}
						/>
					</Link>
				);
			case "year_indicator":
				return (
					<YearIndicatorItem
						key={`year-${item.year}`}
						year={item.year}
						yPct={point.y}
						currentDrawYPercent={currentDrawYPercent}
						style={{
							top: `${point.y}%`,
							left: `${point.x}%`,
						}}
					/>
				);
			default:
				return null;
		}
	});
}
