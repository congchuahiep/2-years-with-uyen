"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/shared/utils/cn";

interface DandelionIconProps {
	className?: string;
	roughConfig?: Options;
}

export function DandelionIcon({
	className,
	roughConfig = {},
}: DandelionIconProps) {
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
			strokeWidth: 0.8,
			stroke: "currentColor",
			...parsedConfig,
		};

		// Bồ công anh: tâm ở (12, 6), bán kính tỏa tia ~7.
		// 12 tia tỏa đều quanh tâm (mỗi tia cách nhau 30°), mỗi tia là 1 line.
		// Đầu mỗi tia có 1 chùm "tua" nhỏ (2-3 sợi ngắn) tạo cảm giác hạt bay.

		const cx = 12;
		const cy = 6;
		const innerR = 1.2; // bán kính tâm (để trống)
		const outerR = 7; // bán kính đầu tia

		const rays: ReturnType<typeof rc.line>[] = [];
		const wisps: ReturnType<typeof rc.line>[] = [];

		for (let i = 0; i < 12; i++) {
			const angle = (i * 30 * Math.PI) / 180;
			const x1 = cx + innerR * Math.cos(angle);
			const y1 = cy + innerR * Math.sin(angle);
			const x2 = cx + outerR * Math.cos(angle);
			const y2 = cy + outerR * Math.sin(angle);

			rays.push(rc.line(x1, y1, x2, y2, options));

			// Chùm "tua" ở đầu tia — 2-3 sợi ngắn xòe ra theo hướng tiếp tuyến
			const wispLen = 0.9;
			const tx = -Math.sin(angle); // tiếp tuyến x
			const ty = Math.cos(angle); // tiếp tuyến y
			wisps.push(
				rc.line(
					x2,
					y2,
					x2 + tx * wispLen - Math.cos(angle) * 0.4,
					y2 + ty * wispLen - Math.sin(angle) * 0.4,
					options,
				),
			);
			wisps.push(
				rc.line(
					x2,
					y2,
					x2 - tx * wispLen - Math.cos(angle) * 0.4,
					y2 - ty * wispLen - Math.sin(angle) * 0.4,
					options,
				),
			);
		}

		// Tâm tròn nhỏ
		const center = rc.circle(cx, cy, innerR * 2, {
			...options,
			fill: "var(--color-yellow-400)",
			fillStyle: "solid",
			roughness: 0.4,
		});

		// Cuống hoa — đường cong từ dưới tâm xuống đáy
		const stem = rc.path("M 12 7 Q 11 14 12 22", {
			...options,
			strokeWidth: 1.2,
			stroke: "var(--color-green-600)",
		});
		// Một chiếc lá nhỏ bên cạnh cuống
		const leaf = rc.path("M 12 15 Q 8 16 6 19 Q 8 20 12 17 Z", {
			...options,
			fill: "var(--color-green-300)",
			fillStyle: "solid",
			stroke: "var(--color-green-600)",
		});

		// z-index: lá -> cuống -> tia + tua -> tâm (đè lên đầu trong của tia)
		svgRef.current.appendChild(leaf);
		svgRef.current.appendChild(stem);
		rays.forEach((node) => {
			svgRef.current?.appendChild(node);
		});
		wisps.forEach((node) => {
			svgRef.current?.appendChild(node);
		});
		svgRef.current.appendChild(center);

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
