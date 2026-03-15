"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface PauseIconProps {
	className?: string;
	roughConfig?: Options;
}

export function PauseIcon({ className, roughConfig = {} }: PauseIconProps) {
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
			roughness: 0.2,
			strokeWidth: 2,
			stroke: "currentColor",
			fill: "currentColor",
			fillStyle: "solid",
			...parsedConfig,
		};

		// Tọa độ cho hai thanh Pause trong viewBox 24x24
		// Thanh thứ nhất
		const rect1 = rc.rectangle(7, 5, 3, 14, options); // x, y, width, height

		// Thanh thứ hai
		const rect2 = rc.rectangle(13, 5, 3, 14, options); // x, y, width, height

		svgRef.current.appendChild(rect1);
		svgRef.current.appendChild(rect2);

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
