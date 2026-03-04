"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface ShootingStarIconProps {
	className?: string;
	roughConfig?: Options;
}

export function ShootingStarIcon({
	className,
	roughConfig = {},
}: ShootingStarIconProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const [isDrawn, setIsDrawn] = useState(false);

	const configStr = JSON.stringify(roughConfig);

	useEffect(() => {
		if (!svgRef.current) return;

		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		const rc = rough.svg(svgRef.current);

		// Component gồm 2 phần:
		// 1. Một Ngôi sao nhỏ nằm góc cúp (top right): M 18 3 L...
		// 2. Vệt sao băng 3 vạch đằng sau kéo tượt (bottom left): M 2 22 L 12 12 ...

		const starPath =
			"M9 8c-1.667.667-5.4 2.7-7 5.5m9.5-2.5C9.167 12.333 4 16.4 2 22m10.5-7.5c-1.167 1.167-3.8 4.1-5 6.5m7.174-14.55.673-3.285 2.225 2.51 3.027-.294-1.768 3.062 1.743 2.639-3.286-.673-2.51 2.225.19-3.156-3.062-1.768 2.768-1.26z";

		const options: Options = {
			roughness: 0.5,
			strokeWidth: 1,
			stroke: "currentColor",
			...JSON.parse(configStr),
		};

		const nodeStar = rc.path(starPath, options);

		svgRef.current.appendChild(nodeStar);

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
