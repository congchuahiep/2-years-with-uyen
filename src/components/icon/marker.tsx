"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface MarkerIconProps {
	className?: string;
	roughConfig?: Options;
}

export function MarkerIcon({ className, roughConfig = {} }: MarkerIconProps) {
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
			roughness: 1,
			strokeWidth: 1.5,
			stroke: "currentColor",
			...parsedConfig,
		};

		const primaryColor = parsedConfig.fill || "var(--color-green-400)";

		// Nắp bút (dài, có gờ/sọc dọc) -> bóp từ 38-62 thành 40-60
		const capNode = rc.path("M 40 10 L 60 10 L 60 50 L 40 50 Z", {
			...options,
			fill: primaryColor,
			fillStyle: "solid",
		});

		// Các sọc dọc trên nắp
		const capLines = [];
		for (let x = 43; x <= 57; x += 3.5) {
			capLines.push(rc.line(x, 15, x, 45, { ...options, strokeWidth: 1 }));
		}

		// Viền mép dưới nắp (chỗ ôm vào thân) -> bóp từ 36-64 thành 38-62
		const capRimNode = rc.path("M 38 50 L 62 50 L 62 54 L 38 54 Z", {
			...options,
			fill: primaryColor,
			fillStyle: "solid",
		});

		// Thân bút trụ dài màu sáng -> bóp từ 40-60 thành 42-58
		const bodyNode = rc.path("M 42 54 L 58 54 L 58 135 L 42 135 Z", {
			...options,
			fill: "var(--color-slate-100)",
			fillStyle: "solid",
		});

		// Đường sọc nổi bật dài pill-shaped dọc thân -> bóp từ 45-55 thành 46-54
		const stripeNode = rc.path(
			"M 46 70 C 46 60, 54 60, 54 70 L 54 120 C 54 130, 46 130, 46 120 Z",
			{
				...options,
				fill: primaryColor,
				fillStyle: "solid",
			},
		);

		// Nét reflection highlight ngắn bên hông phải
		const highlightNode = rc.path(
			"M 56 115 C 56 120, 56 125, 56 130 M 56 100 L 56 110",
			options,
		);

		// Chóp chuôi cắm đáy bút
		const plugNode = rc.path("M 44 135 L 56 135 L 56 142 L 44 142 Z", {
			...options,
			fill: primaryColor,
			fillStyle: "solid",
		});

		svgRef.current.appendChild(capNode);
		capLines.forEach((l) => {
			svgRef.current?.appendChild(l);
		});
		svgRef.current.appendChild(capRimNode);
		svgRef.current.appendChild(bodyNode);
		svgRef.current.appendChild(stripeNode);
		svgRef.current.appendChild(highlightNode);
		svgRef.current.appendChild(plugNode);

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
