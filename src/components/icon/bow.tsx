"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface BowIconProps {
	className?: string;
	roughConfig?: Options;
}

export function BowIcon({ className, roughConfig = {} }: BowIconProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const [isDrawn, setIsDrawn] = useState(false);

	const configStr = JSON.stringify(roughConfig);

	useEffect(() => {
		if (!svgRef.current) return;

		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		const rc = rough.svg(svgRef.current);

		const options: Options = {
			roughness: 1,
			strokeWidth: 1,
			stroke: "currentColor",
			...JSON.parse(configStr),
		};

		// 1. Hai cánh bướm của chiếc nơ
		// Bầu bĩnh và cong phồng ra ngoài tít mép 1 góc (Cubic Bezier -2..26)
		const wingsNode = rc.path(
			"M 11 10 C -2 0, -2 20, 11 10 Z M 13 10 C 26 0, 26 20, 13 10 Z",
			{
				...options,
				// Ruy băng nơ thường có màu tô fill
				fillStyle: "hachure",
			},
		);

		// 2. Hai dải ruy băng mỏng rũ xuống
		// Trái: M 10 12 Q 4 18 5 24
		// Phải: M 14 12 Q 20 18 19 24
		const ribbonNode = rc.path(
			"M 10 12 Q 4 18 5 24 M 14 12 Q 20 18 19 24",
			options,
		);

		// 3. Cục nút thắt NHỎ LẠI mập ở trung tâm Nơ tròn (12, 10)
		const knotNode = rc.ellipse(12, 10, 4, 6, {
			...options,
		});

		svgRef.current.appendChild(wingsNode);
		svgRef.current.appendChild(ribbonNode);
		svgRef.current.appendChild(knotNode);

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
