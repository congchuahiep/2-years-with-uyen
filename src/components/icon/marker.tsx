"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface MarkerIconProps extends React.SVGAttributes<SVGSVGElement> {
	className?: string;
	roughConfig?: Options;
}

export function MarkerIcon({
	className,
	roughConfig = {},
	...props
}: MarkerIconProps) {
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

		// Nắp bút (dài, có gờ/sọc dọc) -> bóp từ 40-60 thành 5-25
		const capNode = rc.path("M 5 10 L 25 10 L 25 50 L 5 50 Z", {
			...options,
			fill: primaryColor,
			fillStyle: "solid",
		});

		// Các sọc dọc trên nắp
		const capLines = [];
		for (let x = 8; x <= 22; x += 3.5) {
			capLines.push(
				rc.line(x, 15, x, 45, {
					...options,
					roughness: 0.5,
					bowing: 0,
					disableMultiStroke: true,
					strokeWidth: 1,
				}),
			);
		}

		// Viền mép dưới nắp (chỗ ôm vào thân) -> bóp từ 38-62 thành 3-27
		const capRimNode = rc.path("M 3 50 L 27 50 L 27 54 L 3 54 Z", {
			...options,
			fill: primaryColor,
			fillStyle: "solid",
		});

		// Thân bút trụ dài màu sáng -> bóp từ 42-58 thành 7-23
		const bodyNode = rc.path("M 7 54 L 23 54 L 23 135 L 7 135 Z", {
			...options,
			fill: "var(--color-slate-100)",
			fillStyle: "solid",
		});

		// Đường sọc nổi bật dài pill-shaped dọc thân -> bóp từ 46-54 thành 11-19
		const stripeNode = rc.path(
			"M 11 70 C 11 60, 19 60, 19 70 L 19 120 C 19 130, 11 130, 11 120 Z",
			{
				...options,
				fill: primaryColor,
				fillStyle: "solid",
			},
		);

		// Nét reflection highlight ngắn bên hông phải
		const highlightNode = rc.path(
			"M 21 115 C 21 120, 21 125, 21 130 M 21 100 L 21 110",
			options,
		);

		// Chóp chuôi cắm đáy bút
		const plugNode = rc.path("M 9 135 L 21 135 L 21 142 L 9 142 Z", {
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
			{...props}
			ref={svgRef}
			viewBox="0 0 30 150"
			className={cn(
				"overflow-visible inline-block transition-opacity duration-300",
				!isDrawn ? "opacity-0" : "opacity-100",
				className,
			)}
		/>
	);
}
