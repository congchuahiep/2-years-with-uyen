"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface PlayIconProps {
	className?: string;
	roughConfig?: Options;
}

export function PlayIcon({ className, roughConfig = {} }: PlayIconProps) {
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
			roughness: 0.5,
			strokeWidth: 2,
			stroke: "currentColor",
			fill: "currentColor",
			fillStyle: "solid",
			...parsedConfig,
		};

		// Tọa độ cho hình tam giác Play trong viewBox 24x24
		// Đỉnh trên (7, 5), đỉnh dưới (7, 19), đỉnh phải (19, 12)
		const playPath: [number, number][] = [
			[7, 5],
			[7, 19],
			[19, 12],
		];

		const node = rc.polygon(playPath, options);

		svgRef.current.appendChild(node);

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
