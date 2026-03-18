"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface PencilIconProps {
	className?: string;
	roughConfig?: Options;
}

export function PencilIcon({ className, roughConfig = {} }: PencilIconProps) {
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

		// Đầu nhọn đen (chì)
		const tipNode = rc.path("M 8 15 L 16 15 L 12 0 Z", {
			...options,
			fill: "var(--color-slate-800)",
			fillStyle: "solid",
		});

		// Gỗ vàng được gọt lộ ra
		const woodNode = rc.path("M 2 35 L 22 35 L 16 15 L 8 15 Z", {
			...options,
			fill: "var(--color-orange-200)",
			fillStyle: "solid",
		});

		// Đường zig-zac vát gỗ với thân
		const zigZacNode = rc.path(
			"M 2 35 L 7 30 L 12 35 L 17 30 L 22 35",
			options,
		);

		// Thân bút chì dài sọc (Lục giác)
		const bodyNode = rc.path("M 2 35 L 2 120 L 22 120 L 22 35", {
			fill: parsedConfig.fill || "var(--color-yellow-500)",
			fillStyle: "hachure",
			...options,
		});
		const line1 = rc.line(8, 35, 8, 120, options);
		const line2 = rc.line(16, 35, 16, 120, options);

		// Kẹp nhôm giữ tẩy
		const metalNode = rc.path("M 0 120 L 24 120 L 24 130 L 0 130 Z", {
			...options,
			fill: "var(--color-gray-300)",
			fillStyle: "solid",
		});

		// Cục tẩy đuôi tròn
		const eraserNode = rc.path("M 0 130 L 24 130 C 24 145, 0 145, 0 130", {
			...options,
			fill: "var(--color-red-300)",
			fillStyle: "solid",
		});

		svgRef.current.appendChild(tipNode);
		svgRef.current.appendChild(woodNode);
		svgRef.current.appendChild(zigZacNode);
		svgRef.current.appendChild(bodyNode);
		svgRef.current.appendChild(line1);
		svgRef.current.appendChild(line2);
		svgRef.current.appendChild(metalNode);
		svgRef.current.appendChild(eraserNode);

		if (!isDrawn) {
			requestAnimationFrame(() => setIsDrawn(true));
		}
	}, [configStr, isDrawn]);

	return (
		<svg
			ref={svgRef}
			viewBox="0 0 24 150"
			className={cn(
				"overflow-visible inline-block transition-opacity duration-300",
				!isDrawn ? "opacity-0" : "opacity-100",
				className,
			)}
		/>
	);
}
