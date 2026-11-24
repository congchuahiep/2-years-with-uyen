"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/shared/utils/cn";

interface TulipIconProps {
	className?: string;
	roughConfig?: Options;
}

export function TulipIcon({ className, roughConfig = {} }: TulipIconProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const [isDrawn, setIsDrawn] = useState(false);

	const configStr = JSON.stringify(roughConfig);

	useEffect(() => {
		if (!svgRef.current) return;

		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		const rc = rough.svg(svgRef.current);
		const parsedConfig = JSON.parse(configStr);

		const options: Options = {
			roughness: 0.6,
			strokeWidth: 1,
			stroke: "currentColor",
			...parsedConfig,
		};

		// Hoa tulip: 3 cánh xếp chồng — 1 cánh sau (lớn), 2 cánh trước (nhỏ, lệch trái/phải).
		// Tâm bông hoa khoảng (12, 8). Cuống hoa từ (12, 13) xuống (12, 22).

		// 1. Cánh sau (lớn, màu đậm) — viền cong hình chữ U ngược
		const backPetal = rc.path(
			"M 6 8 Q 5 13 8 14 Q 9 14.5 12 14 Q 15 14.5 16 14 Q 19 13 18 8 Q 17 5 12 4 Q 7 5 6 8 Z",
			{
				...options,
				fill: "var(--color-pink-500)",
				fillStyle: "solid",
			},
		);

		// 2. Cánh trái (màu nhạt hơn, che một phần cánh sau)
		const leftPetal = rc.path(
			"M 7 9 Q 5 14 8 14.5 Q 10 14.7 11 13 Q 11.5 11 11 9 Q 10 6 8 6 Q 7 7 7 9 Z",
			{
				...options,
				fill: "var(--color-pink-300)",
				fillStyle: "solid",
			},
		);

		// 3. Cánh phải
		const rightPetal = rc.path(
			"M 17 9 Q 19 14 16 14.5 Q 14 14.7 13 13 Q 12.5 11 13 9 Q 14 6 16 6 Q 17 7 17 9 Z",
			{
				...options,
				fill: "var(--color-pink-300)",
				fillStyle: "solid",
			},
		);

		// 4. Đường viền trên (gợn nhẹ phân cách các cánh)
		const ridgeLeft = rc.path("M 11 9 Q 11.5 12 11 13", {
			...options,
			stroke: "var(--color-pink-700)",
			strokeWidth: 0.8,
		});
		const ridgeRight = rc.path("M 13 9 Q 12.5 12 13 13", {
			...options,
			stroke: "var(--color-pink-700)",
			strokeWidth: 0.8,
		});

		// 5. Cuống hoa (thẳng, xanh)
		const stem = rc.line(12, 14, 12, 22, {
			...options,
			stroke: "var(--color-green-600)",
			strokeWidth: 1.5,
		});

		// 6. Lá tulip dài, cong — bên trái cuống
		const leftLeaf = rc.path(
			"M 12 16 Q 7 17 5 20 Q 7 21 12 19 Z",
			{
				...options,
				fill: "var(--color-green-300)",
				fillStyle: "solid",
				stroke: "var(--color-green-600)",
			},
		);
		// 7. Lá tulip dài, cong — bên phải cuống
		const rightLeaf = rc.path(
			"M 12 18 Q 17 19 19 22 Q 17 23 12 21 Z",
			{
				...options,
				fill: "var(--color-green-300)",
				fillStyle: "solid",
				stroke: "var(--color-green-600)",
			},
		);

		// z-index: lá -> cuống -> cánh sau -> cánh trái/phải -> gợn
		svgRef.current.appendChild(leftLeaf);
		svgRef.current.appendChild(rightLeaf);
		svgRef.current.appendChild(stem);
		svgRef.current.appendChild(backPetal);
		svgRef.current.appendChild(leftPetal);
		svgRef.current.appendChild(rightPetal);
		svgRef.current.appendChild(ridgeLeft);
		svgRef.current.appendChild(ridgeRight);

		if (!isDrawn) {
			requestAnimationFrame(() => setIsDrawn(true));
		}
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
