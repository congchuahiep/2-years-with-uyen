"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface RoseIconProps {
	className?: string;
	roughConfig?: Options;
}

export function RoseIcon({ className, roughConfig = {} }: RoseIconProps) {
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
			roughness: 0.7,
			strokeWidth: 1,
			stroke: "currentColor",
			...parsedConfig,
		};

		// Tâm hoa hồng (12, 8). Cánh hoa cuộn xoắn bằng 2 vòng ellipse lệch tâm.
		// 1. Lớp cánh ngoài cùng: ellipse rộng, tô hồng đậm
		const outerPetal = rc.ellipse(12, 8, 14, 10, {
			...options,
			fill: "var(--color-pink-400)",
			fillStyle: "solid",
			roughness: 0.5,
		});
		// 2. Lớp cánh giữa: ellipse nhỏ hơn, hồng nhạt hơn, lệch phải-trên
		const midPetal = rc.ellipse(13, 7, 9, 7, {
			...options,
			fill: "var(--color-pink-300)",
			fillStyle: "solid",
			roughness: 0.5,
		});
		// 3. Lớp cánh trong: ellipse nhỏ nhất, màu sáng, lệch trái-dưới
		const innerPetal = rc.ellipse(11.5, 8.5, 5, 4, {
			...options,
			fill: "var(--color-pink-200)",
			fillStyle: "solid",
			roughness: 0.4,
		});
		// 4. Tâm xoắn ốc (highlight nhỏ ở giữa)
		const center = rc.circle(12, 8, 1.6, {
			...options,
			fill: "var(--color-pink-600)",
			fillStyle: "solid",
			roughness: 0,
		});

		// 5. Cành (stem) — đường cong từ dưới hoa xuống đáy
		const stem = rc.path("M 12 13 Q 11 18 12 22", {
			...options,
			strokeWidth: 1.5,
			stroke: "var(--color-green-600)",
		});
		// 6. Một chiếc lá nhỏ bên cạnh cành
		const leaf = rc.path("M 12 17 Q 8 17 6 19 Q 8 20 12 19 Z", {
			...options,
			fill: "var(--color-green-300)",
			fillStyle: "solid",
			stroke: "var(--color-green-600)",
		});

		// z-index: cành + lá (dưới) -> cánh ngoài -> cánh giữa -> cánh trong -> tâm
		svgRef.current.appendChild(stem);
		svgRef.current.appendChild(leaf);
		svgRef.current.appendChild(outerPetal);
		svgRef.current.appendChild(midPetal);
		svgRef.current.appendChild(innerPetal);
		svgRef.current.appendChild(center);

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
