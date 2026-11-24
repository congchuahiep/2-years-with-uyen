"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/shared/utils/cn";

interface CurvedArrowIconProps {
	className?: string;
	roughConfig?: Options;
}

export function CurvedArrowIcon({
	className,
	roughConfig = {},
}: CurvedArrowIconProps) {
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
			strokeWidth: 1,
			stroke: "currentColor",
			...parsedConfig,
		};

		// Mũi tên cong — 2 subpath trong 1 path (thân cong + đầu mũi tên),
		// đã scale từ viewBox 863x240 -> fit ngang 22 đơn vị, căn giữa dọc trong 24x24.
		// Chỉ stroke (fill none) như SVG gốc — màu theo currentColor.
		const arrowPath =
			"M 1.000 12.158 C 7.334 1.396 6.722 21.981 13.597 12.452 C 20.539 2.830 14.312 21.142 22.962 11.507 M 19.627 12.621 L 23.000 11.509 L 21.697 14.946";

		const node = rc.path(arrowPath, options);
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