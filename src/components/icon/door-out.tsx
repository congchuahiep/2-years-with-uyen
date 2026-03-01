"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface DoorOutIconProps {
	className?: string;
	roughConfig?: Options;
}

export function DoorOutIcon({ className, roughConfig }: DoorOutIconProps) {
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if (!svgRef.current) return;

		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		const rc = rough.svg(svgRef.current);

		// Path:
		// 1. Khung cửa bên phải: M 14 4 L 20 4 L 20 20 L 14 20
		// 2. Trục mũi tên đi từ cửa ra (phải sang trái): M 16 12 L 3 12
		// 3. Hai đỉnh mũi tên: M 7 7 L 2 12 L 7 17
		const node = rc.path(
			"M 14 4 L 20 4 L 20 20 L 14 20 M 16 12 L 3 12 M 7 7 L 2 12 L 7 17",
			{
				roughness: 1.5,
				strokeWidth: 2,
				stroke: "currentColor",
				...roughConfig,
			},
		);

		svgRef.current.appendChild(node);
	}, [roughConfig]);

	return (
		<svg
			ref={svgRef}
			viewBox="0 0 24 24"
			className={cn(
				"w-6 h-6 overflow-visible inline-block relative -top-0.5",
				className,
			)}
		/>
	);
}
