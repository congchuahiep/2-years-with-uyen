"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/shared/utils/cn";

/** Màu mặc định cho 6 ô màu (theo CSS variables của theme). */
const DEFAULT_DOT_COLORS = [
	"var(--red)",
	"var(--yellow)",
	"var(--green)",
	"var(--sky)",
	"var(--purple)",
	"currentColor",
];

// Toạ độ tâm của 6 ô màu (theo viewBox 0 -11 64 64)
const DOT_POSITIONS: Array<[number, number]> = [
	[31.5, 6.5],
	[17.5, 8.5],
	[33.5, 34.5],
	[47.5, 29.5],
	[45.5, 9.5],
	[53.5, 18.5],
];

interface PaletteIconProps {
	className?: string;
	roughConfig?: Options;
	/** Màu fill cho từng ô màu, theo thứ tự 6 ô (trái → phải). Thiếu ô nào sẽ dùng màu mặc định của theme. */
	dotColors?: string[];
}

export function PaletteIcon({
	className,
	roughConfig = {},
	dotColors = [],
}: PaletteIconProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const [isDrawn, setIsDrawn] = useState(false);

	const configStr = JSON.stringify(roughConfig);
	const dotColorsStr = JSON.stringify(dotColors);

	useEffect(() => {
		if (!svgRef.current) return;

		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		const rc = rough.svg(svgRef.current);
		const parsedConfig = JSON.parse(configStr);
		const parsedDotColors = JSON.parse(dotColorsStr) as string[] | undefined;

		const options: Options = {
			roughness: 0.5,
			strokeWidth: 1,
			stroke: "currentColor",
			...parsedConfig,
		};

		// Thân bảng màu: nửa trên bo tròn, phía dưới lõm tạo "ngón tay cầm"
		const palettePath =
			"M 62 20 C 62 31 48.1 40 31 40 C 7 40 24 28.3 21 23.4 C 17 17 0 36.1 0 20 C 0 9 13.9 0 31 0 C 48.1 0 62 9 62 20 L 62 20 Z";
		const body = rc.path(palettePath, options);
		svgRef.current.appendChild(body);

		// 6 ô màu — mỗi ô được fill màu riêng (lấy từ prop, thiếu thì dùng màu mặc định)
		for (let i = 0; i < DOT_POSITIONS.length; i++) {
			const [cx, cy] = DOT_POSITIONS[i];
			const fill = parsedDotColors?.[i] ?? DEFAULT_DOT_COLORS[i];
			const dot = rc.ellipse(cx, cy, 9, 5, {
				...options,
				fill,
				fillStyle: "solid",
			});
			svgRef.current.appendChild(dot);
		}

		if (!isDrawn) requestAnimationFrame(() => setIsDrawn(true));
	}, [configStr, dotColorsStr, isDrawn]);

	return (
		<svg
			ref={svgRef}
			viewBox="0 -11 64 64"
			className={cn(
				"w-16 h-16 overflow-visible inline-block transition-opacity duration-300",
				!isDrawn ? "opacity-0" : "opacity-100",
				className,
			)}
		/>
	);
}
