"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/shared/utils/cn";

interface ButterflyIconProps {
	className?: string;
	roughConfig?: Options;
}

export function ButterflyIcon({
	className,
	roughConfig = {},
}: ButterflyIconProps) {
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

		// Con bướm: 4 cánh (2 trên to, 2 dưới nhỏ hơn) + thân giữa.
		// Path đã scale sẵn từ viewBox -3 0 150 150 sang viewBox 0 0 24 24
		// (scale = 0.16, tx = 0.48).
		//
		// Cấu trúc 2 lớp:
		//   1. Thân bướm (vàng) — path chính, 4 cánh đối xứng trái-phải.
		//   2. Bóng đổ cánh phải — path thứ 2, tô đen trong suốt (opacity 0.3),
		//      vẽ SAU thân bướm để đè lên phần cánh phải.

		// 1. Thân bướm — tô vàng cam
		const bodyPath =
			"M21.600 12.980C21.600 14.361 20.526 15.480 19.200 15.480C19.106 15.480 18.701 15.420 18.641 15.405L16.027 14.893C17.365 16.541 18.072 17.802 17.559 18.299C17.052 18.792 15.870 18.076 14.327 16.711L14.832 19.480C14.864 19.642 14.880 19.809 14.880 19.980C14.880 21.361 13.806 22.480 12.480 22.480C11.154 22.480 10.080 21.361 10.080 19.980C10.080 19.696 10.136 19.427 10.219 19.172L11.158 16.159C11.158 16.159 8.897 18.353 8.846 18.401L8.622 18.594C7.965 19.140 7.145 19.480 6.240 19.480C4.119 19.480 2.400 17.689 2.400 15.480C2.400 13.271 4.119 11.480 6.240 11.480H9.184C7.106 9.155 5.790 7.293 6.441 6.661C7.090 6.031 8.839 7.375 11.040 9.529V6.480C11.040 4.271 12.759 2.480 14.880 2.480C17.001 2.480 18.720 4.271 18.720 6.480C18.720 7.638 18.241 8.672 17.486 9.402L14.747 11.875C14.747 11.875 18.550 10.566 18.720 10.530H18.721C18.721 10.530 19.037 10.480 19.201 10.480C20.526 10.480 21.600 11.599 21.600 12.980Z";

		const bodyNode = rc.path(bodyPath, {
			fill: "var(--color-amber-400)",
			fillStyle: "solid",
			roughness: 0.3,
			...options,
		});

		// 2. Bóng đổ cánh phải — đen trong suốt (opacity 0.3)
		const shadowPath =
			"M12.960 11.480C16.030 14.694 18.389 17.494 17.559 18.299C16.730 19.104 14.110 16.694 11.040 13.480C7.970 10.266 5.611 7.466 6.441 6.661C7.270 5.856 9.890 8.266 12.960 11.480Z";

		const shadowNode = rc.path(shadowPath, {
			fill: "var(--color-amber-700)",
			fillStyle: "solid",
			stroke: "transparent",
			strokeWidth: 0,
			roughness: 0.3,
			...options,
		});

		// Thân bướm (dưới) -> bóng đổ (trên, đè lên nửa phải).
		// Bóng đổ wrap trong <g opacity="0.3"> để giữ đúng cảm giác trong suốt
		// của bản gốc (Rough.js không nhận prop opacity trực tiếp).
		svgRef.current.appendChild(bodyNode);
		const shadowGroup = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"g",
		);
		shadowGroup.setAttribute("opacity", "0.3");
		shadowGroup.appendChild(shadowNode);
		svgRef.current.appendChild(shadowGroup);

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
