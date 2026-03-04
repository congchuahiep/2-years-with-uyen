"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface DaisyIconProps {
	className?: string;
	roughConfig?: Options;
}

export function DaisyIcon({ className, roughConfig = {} }: DaisyIconProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const [isDrawn, setIsDrawn] = useState(false);

	const configStr = JSON.stringify(roughConfig);

	useEffect(() => {
		if (!svgRef.current) return;

		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		const rc = rough.svg(svgRef.current);

		const options: Options = {
			roughness: 1,
			strokeWidth: 1,
			stroke: "currentColor",
			...JSON.parse(configStr),
		};

		// Nhụy cúc vòng tròn trung tâm màu Vàng đặc: tâm 12, 11
		const centerNode = rc.circle(12, 11, 6, {
			...options,
			fill: "var(--color-yellow-400)",
			fillStyle: "solid",
			stroke: "var(--color-yellow-600)",
		});

		// 6 cánh hoa Cúc xoay tròn quanh tâm bằng thuật toán (Math)
		// r = 9, góc 60 độ
		const petals = [
			{ cx: 12, cy: 3 }, // Top
			{ cx: 18.9, cy: 7 }, // T-Right
			{ cx: 18.9, cy: 15 }, // B-Right
			{ cx: 12, cy: 19 }, // Bottom
			{ cx: 5.1, cy: 15 }, // B-Left
			{ cx: 5.1, cy: 7 }, // T-Left
		];

		const petalNodes = petals.map((p) =>
			rc.circle(p.cx, p.cy, 8, {
				...options,
				fill: "white", // Hoa cúc họa mi màu trắng
				fillStyle: "solid",
			}),
		);

		// Thêm một đoạn cuống lá và rễ nhỏ mọc chéo góc dứoi
		const stemNode = rc.path("M 10 20 Q 8 23 4 24 M 14 19 Q 18 21 21 20", {
			...options,
			strokeWidth: 2,
			stroke: "var(--color-green-600)",
		});

		// Lớp dưới (Cành) -> Lớp giữa (Cánh HOA) -> Lớp Trọng tâm (Nhụy)
		svgRef.current.appendChild(stemNode);
		petalNodes.forEach((node) => {
			svgRef.current?.appendChild(node);
		});
		svgRef.current.appendChild(centerNode);

		if (!isDrawn) requestAnimationFrame(() => setIsDrawn(true));
	}, [configStr, isDrawn]);

	return (
		<svg
			ref={svgRef}
			viewBox="0 0 24 24"
			className={cn(
				"w-6 h-6 overflow-visible inline-block transition-opacity duration-300",
				!isDrawn ? "opacity-0" : "opacity-100",
				className,
			)}
		/>
	);
}
