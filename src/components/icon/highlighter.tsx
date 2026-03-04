"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface HighlighterIconProps {
	className?: string;
	roughConfig?: Options;
}

export function HighlighterIcon({
	className,
	roughConfig = {},
}: HighlighterIconProps) {
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
			roughness: 1.5,
			strokeWidth: 1.5,
			stroke: "currentColor",
			...parsedConfig,
		};

		// The highlighter has 4 parts: Top Cap, Body, Collar, Nib

		// 1. Top Cap (Nắp đế nhỏ ở đỉnh)
		const topCapNode = rc.path("M 43 20 L 57 20 L 59 25 L 41 25 Z", {
			...options,
			fill: "var(--color-slate-700)",
			fillStyle: "solid",
		});

		// 2. Thân bút vàng (to và hơi phình giữa)
		const bodyNode = rc.path(
			"M 41 25 L 59 25 L 61 60 L 59 90 L 41 90 L 39 60 Z",
			{
				...options,
				fill: parsedConfig.fill || "var(--color-yellow-300)",
				fillStyle: "solid",
			},
		);

		// Đường vân bóng trên thân bút dọc 2 bên biên
		const reflection1 = rc.path("M 43 35 C 41 50, 41 70, 43 80", options);
		const reflection2 = rc.path("M 57 35 C 59 50, 59 70, 57 80", options);

		// 3. Yếm cổ chai màu đen (thu nhỏ cắm vào ngòi)
		const collarNode = rc.path(
			"M 41 90 L 59 90 C 59 95, 56 100, 55 105 L 54 115 L 46 115 L 45 105 C 44 100, 41 95, 41 90 Z",
			{
				...options,
				fill: "var(--color-slate-700)",
				fillStyle: "solid",
			},
		);

		// 4. Ngòi dạ quang cắt vát xéo (Nib)
		const nibNode = rc.path("M 46 115 L 54 115 L 54 125 L 46 130 Z", {
			...options,
			fill: parsedConfig.fill || "var(--color-orange-300)",
			fillStyle: "solid",
		});

		// Đường vân trên cổ yếm đen
		const collarLine = rc.line(50, 95, 50, 110, options);

		svgRef.current.appendChild(topCapNode);
		svgRef.current.appendChild(bodyNode);
		svgRef.current.appendChild(reflection1);
		svgRef.current.appendChild(reflection2);
		svgRef.current.appendChild(collarNode);
		svgRef.current.appendChild(collarLine);
		svgRef.current.appendChild(nibNode);

		if (!isDrawn) {
			requestAnimationFrame(() => setIsDrawn(true));
		}
	}, [configStr, isDrawn]);

	return (
		<svg
			ref={svgRef}
			viewBox="0 0 100 150"
			className={cn(
				"overflow-visible inline-block transition-opacity duration-300",
				!isDrawn ? "opacity-0" : "opacity-100",
				className,
			)}
		/>
	);
}
