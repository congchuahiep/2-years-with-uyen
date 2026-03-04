"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface CoffeeIconProps {
	className?: string;
	roughConfig?: Options;
}

export function CoffeeIcon({ className, roughConfig = {} }: CoffeeIconProps) {
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
			strokeWidth: 1,
			stroke: "currentColor",
			...parsedConfig,
		};

		// The Coffee Cup viewed from Top-Down has a 100x100 ViewBox.

		// 1. Saucer (Chiếc đĩa hứng bên dưới)
		// Đường kính to nhất
		const saucerNode = rc.circle(50, 50, 90, {
			...options,
			fill: parsedConfig.fill || "var(--color-amber-100)",
			fillStyle: "solid",
		});

		// The handle (Quai cốc) - Quai hình chữ nhật bo tròn ngoài (half-pill)
		const handleNode = rc.path(
			"M 80 40 L 95 40 C 105 40, 105 60, 95 60 L 80 60 Z",
			{
				...options,
				fill: parsedConfig.fill || "var(--color-orange-50)",
				fillStyle: "solid",
			},
		);

		// The Cup (Thân ly/cốc)
		const cupNode = rc.circle(50, 50, 68, {
			...options,
			fill: parsedConfig.fill || "var(--color-orange-50)", // Default là ly gốm màu kem
			fillStyle: "solid",
		});

		// Liquid (Mặt cà phê sóng sánh)
		const liquidNode = rc.circle(50, 50, 56, {
			...options,
			fill: "var(--color-orange-950)", // Đen nâu Espresso đậm
			fillStyle: "solid",
		});

		// Ghép lại layer từ dưới lên trên
		svgRef.current.appendChild(saucerNode); // Đĩa ở dưới
		svgRef.current.appendChild(handleNode); // Quai
		svgRef.current.appendChild(cupNode); // Ly sứ
		svgRef.current.appendChild(liquidNode); // Cà phê

		if (!isDrawn) {
			requestAnimationFrame(() => setIsDrawn(true));
		}
	}, [configStr, isDrawn]);

	return (
		<svg
			ref={svgRef}
			viewBox="0 0 100 100"
			className={cn(
				"overflow-visible inline-block transition-opacity duration-300",
				!isDrawn ? "opacity-0" : "opacity-100",
				className,
			)}
		/>
	);
}
