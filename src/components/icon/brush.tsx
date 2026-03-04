"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface BrushIconProps {
	className?: string;
	roughConfig?: Options;
}

export function BrushIcon({ className, roughConfig = {} }: BrushIconProps) {
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

		// Cọ vẽ mỹ thuật có chóp lá nhọn

		// 1. Lông cọ bồng ở giữa rụt nhọn đầu (như củ hành)
		const bristleNode = rc.path(
			"M 40 40 C 20 20, 45 0, 50 0 C 55 0, 80 20, 60 40 Z",
			{
				...options,
				fill: "var(--color-amber-900)",
				fillStyle: "hachure", // Nét gạch như lọn tóc
			},
		);

		// 2. Chụp thiếc kim loại nối cán cọ
		const ferruleNode = rc.path("M 42 40 L 58 40 L 55 60 L 45 60 Z", {
			...options,
			fill: "var(--color-gray-300)",
			fillStyle: "solid",
		});
		// Đường gân vòng kẹp thiếc
		const ring1 = rc.line(44, 48, 56, 48, options);
		const ring2 = rc.line(45, 54, 55, 54, options);

		// 3. Cán cọ dài dần thuôn nhọn
		const handleNode = rc.path(
			"M 45 60 L 55 60 L 52 140 C 52 145, 48 145, 48 140 Z",
			{
				...options,
				fill: parsedConfig.fill || "var(--color-amber-700)",
				fillStyle: "solid",
			},
		);

		svgRef.current.appendChild(bristleNode);
		svgRef.current.appendChild(ferruleNode);
		svgRef.current.appendChild(ring1);
		svgRef.current.appendChild(ring2);
		svgRef.current.appendChild(handleNode);

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
