"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface LongArrowIconProps {
	className?: string;
	roughConfig?: Options;
}

export function LongArrowIcon({
	className,
	roughConfig = {},
}: LongArrowIconProps) {
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if (!svgRef.current) return;

		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		const rc = rough.svg(svgRef.current);

		const node = rc.path(
			// Mũi tên uốn lượn kiểu chữ S mềm mại chỉ xuống dưới
			"M0.5 0C0.5 0 0.499969 43.0933 35.3514 59.3067C70.2029 75.52 80.5 77.6533 80.5 77.6533M80.5 77.6533L65 83.5M80.5 77.6533L73 63",
			{
				roughness: 1.8,
				strokeWidth: 2.5,
				stroke: "currentColor",
				...roughConfig,
			},
		);

		svgRef.current.appendChild(node);
	}, [roughConfig]);

	return (
		<svg
			ref={svgRef}
			viewBox="0 0 100 100"
			className={cn("w-16 h-16 overflow-visible inline-block", className)}
		/>
	);
}
