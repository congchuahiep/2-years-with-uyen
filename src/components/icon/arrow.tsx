"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface ArrowIconProps {
	className?: string;
	variant?: "straight" | "curved" | "spiral" | "thick";
	roughConfig?: Options;
}

export function ArrowIcon({
	className,
	variant = "straight",
	roughConfig = {},
}: ArrowIconProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const [isDrawn, setIsDrawn] = useState(false);

	const configStr = JSON.stringify(roughConfig);

	useEffect(() => {
		if (!svgRef.current) return;

		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		const rc = rough.svg(svgRef.current);

		let node: SVGElement;
		const options: Options = {
			roughness: 1,
			strokeWidth: 1,
			stroke: "currentColor",
			...JSON.parse(configStr),
		};

		switch (variant) {
			case "straight":
				// Mũi tên thẳng tắp: Phải sang TRái
				node = rc.path("M 21 12 L 4 12 M 10 6 L 4 12 L 10 18", options);
				break;
			case "curved":
				// Mũi tên cong xoắn 1 nhịp (Bắt đầu từ trái dưới 4 20 uốn vòng lên giữa 20 12) ngạnh tại (20 12)
				node = rc.path("M 4 20 Q 14 18 20 12 M 14 6 L 20 12 L 18 19", options);
				break;
			case "spiral":
				// Mũi tên lốc xoáy khoanh vùng - tâm điểm trỏ sang phải
				node = rc.path(
					"M 14 18 Q 6 22 4 14 Q 2 4 14 6 Q 22 8 20 16 Q 18 22 10 20 Q 5 18 7 12 Q 9 6 15 8 L 22 8 M 18 4 L 22 8 L 18 12",
					options,
				);
				break;
			case "thick":
				// Mũi tên dày (Khối đặc vẽ path vòng tròn - có thể Fill tô màu) mũi chỉ phải
				node = rc.path("M 2 8 L 12 8 L 12 4 L 22 12 L 12 20 L 12 16 L 2 16 Z", {
					fillStyle: "zigzag", // Phù hợp nếu người dùng pass `fill` vào roughConfig
					...options,
				});
				break;
			default:
				node = rc.path("M 21 12 L 4 12 M 10 6 L 4 12 L 10 18", options);
		}

		svgRef.current.appendChild(node);

		if (!isDrawn) requestAnimationFrame(() => setIsDrawn(true));
	}, [variant, configStr, isDrawn]);

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
