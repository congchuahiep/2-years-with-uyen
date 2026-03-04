"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface HeartIconProps {
	className?: string;
	roughConfig?: Options;
}

export function HeartIcon({ className, roughConfig = {} }: HeartIconProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const [isDrawn, setIsDrawn] = useState(false);

	const configStr = JSON.stringify(roughConfig);

	useEffect(() => {
		if (!svgRef.current) return;

		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		const rc = rough.svg(svgRef.current);

		// Bezier Curve Trái Tim chuẩn nét (M tại lõm giữa: 12, 5)
		const heartPath =
			"M 12 21.35 L 10.55 20.03 C 5.4 15.36 2 12.28 2 8.5 C 2 5.42 4.42 3 7.5 3 C 9.24 3 10.91 3.81 12 5.09 C 13.09 3.81 14.76 3 16.5 3 C 19.58 3 22 5.42 22 8.5 C 22 12.28 18.6 15.36 13.45 20.04 L 12 21.35 Z";

		const parsedConfig = JSON.parse(configStr);
		const node = rc.path(heartPath, {
			roughness: 0.5, // Tạo viền gai góc bẻ gãy mộc mạc hơn
			strokeWidth: 1,
			fillStyle: "solid",
			stroke: "currentColor",
			...parsedConfig,
		});

		svgRef.current.appendChild(node);

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
