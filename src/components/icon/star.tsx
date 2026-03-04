"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface StarIconProps {
	className?: string;
	roughConfig?: Options;
}

export function StarIcon({ className, roughConfig = {} }: StarIconProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const [isDrawn, setIsDrawn] = useState(false);

	const configStr = JSON.stringify(roughConfig);

	useEffect(() => {
		if (!svgRef.current) return;

		// Cleanup an toàn để xoá path rác lúc StrictMode hoặc prop change
		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		const rc = rough.svg(svgRef.current);

		// Math Path cho Ngôi sao 5 cánh vừa khít viewBox 24x24
		// Đi từ đỉnh trên cùng (12, 2) zig zag dọc thân
		const node = rc.path(
			"M 12 2 L 15.09 8.26 L 22 9.27 L 17 14.14 L 18.18 21.02 L 12 17.77 L 5.82 21.02 L 7 14.14 L 2 9.27 L 8.91 8.26 Z",
			{
				roughness: 1.2,
				strokeWidth: 2,
				stroke: "currentColor",
				...JSON.parse(configStr),
			},
		);

		svgRef.current.appendChild(node);

		// Áp dụng tối ưu isDrawn chống giật flash/chặn render như button.tsx
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
