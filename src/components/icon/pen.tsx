"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface PenIconProps {
	className?: string;
	roughConfig?: Options;
}

export function PenIcon({ className, roughConfig = {} }: PenIconProps) {
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

		// Bút mực nắp xanh bo tròn

		// 1. Thân bút dài trắng
		const bodyNode = rc.path("M 42 50 L 42 135 Q 50 150 58 135 L 58 50 Z", {
			...options,
			fill: "var(--color-slate-100)",
			fillStyle: "solid",
		});

		// 2. Chỗ tì tay (Có vân)
		const gripNode = rc.path("M 42 90 L 58 90 L 58 125 L 42 125 Z", {
			...options,
			fill: parsedConfig.fill || "var(--color-blue-400)",
			fillStyle: "hachure",
		});
		// Đường vân grip
		const grips = [];
		for (let y = 95; y <= 120; y += 5) {
			grips.push(rc.line(42, y, 58, y, options));
		}

		// 3. Nắp bút to úp chụp phía trên
		const capNode = rc.path("M 40 50 L 60 50 L 60 20 C 60 0, 40 0, 40 20 Z", {
			...options,
			fill: parsedConfig.fill || "var(--color-blue-400)",
			fillStyle: "solid",
		});

		// 4. Kẹp cài áo thòng xuống từ nắp
		const clipNode = rc.path("M 60 15 Q 68 15 65 25 L 62 50 L 60 50 Z", {
			...options,
			fill: parsedConfig.fill || "var(--color-blue-500)",
			fillStyle: "solid",
		});

		svgRef.current.appendChild(bodyNode);
		svgRef.current.appendChild(gripNode);
		grips.forEach((g) => {
			svgRef.current?.appendChild(g);
		});
		svgRef.current.appendChild(capNode);
		svgRef.current.appendChild(clipNode);

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
