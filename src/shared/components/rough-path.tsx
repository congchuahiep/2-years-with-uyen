"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import type { FillStyle } from "@/shared/types/rough";
import cn from "@/shared/utils/cn";

interface RoughPathProps {
	className?: string;
	/** SVG path string (data `d`). Ráp path vào đây là chạy. */
	d: string;
	/** ViewBox của path — chỉnh nếu path của bạn nằm ngoài tọa độ 24x24. */
	viewBox?: string;
	roughConfig?: Options & { fillStyle?: FillStyle };
}

/**
 * Component vẽ 1 đường cong uốn lượn bất kỳ bằng Rough.js.
 *
 * Cách dùng: lấy path string (thuộc tính `d`) từ Figma / Method Draw /
 * SVGPathEditor — hoặc tự viết tay — rồi ráp vào prop `d`.
 *
 * Cheat-sheet path đơn giản (hệ tọa độ viewBox):
 *   M x y        — Nhấc bút tới điểm (x, y)
 *   L x y        — Đường thẳng tới (x, y)
 *   Q cx cy x y  — Đường cong qua 1 điểm điều khiển (dễ nhất khi mới bắt đầu)
 *   C x1 y1 x2 y2 x y — Đường cong qua 2 điểm điều khiển
 *   S x2 y2 x y  — Đường cong mượt nối tiếp đoạn C trước đó
 *   Z            — Đóng kín hình
 *
 * Ví dụ 1 — sóng lượn (2 đoạn cong):
 *   d="M 2 18 Q 8 4 14 12 Q 20 20 22 6"
 *
 * Ví dụ 2 — vòng xoắn trái tim:
 *   d="M 4 14 C 4 18 8 20 12 16 C 16 20 20 18 20 14 C 20 8 12 6 12 2"
 *
 * Mẹo: vẽ trong viewBox lớn hơn (vd "0 0 200 200") cho dễ, sau đó scale
 * xuống bằng className (size-*) — Rough.js tự giãn theo viewBox.
 */
export const RoughPath = ({
	className,
	d,
	viewBox = "0 0 24 24",
	roughConfig = {},
}: RoughPathProps) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const [isDrawn, setIsDrawn] = useState(false);

	const configStr = JSON.stringify(roughConfig);

	useEffect(() => {
		if (!svgRef.current) return;

		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		const parsedConfig = JSON.parse(configStr);
		const rc = rough.svg(svgRef.current);

		const options: Options = {
			roughness: 0.6,
			strokeWidth: 1.5,
			stroke: "currentColor",
			...parsedConfig,
		};

		const node = rc.path(d, options);
		svgRef.current.appendChild(node);

		if (!isDrawn) {
			requestAnimationFrame(() => setIsDrawn(true));
		}
	}, [configStr, isDrawn, d]);

	return (
		<svg
			ref={svgRef}
			viewBox={viewBox}
			className={cn(
				"w-6 h-6 overflow-visible inline-block transition-opacity duration-300",
				!isDrawn ? "opacity-0" : "opacity-100",
				className,
			)}
		/>
	);
};