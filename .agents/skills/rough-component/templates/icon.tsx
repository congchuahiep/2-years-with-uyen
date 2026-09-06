"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

/**
 * Template icon vẽ tay bằng Rough.js (viewBox cố định — không đo kích thước).
 *
 * Cách dùng: copy file này vào `src/components/icon/`, đổi tên thành `XxxIcon` thật,
 * và thay path trong useEffect bằng hình dáng icon mong muốn (viết tay SVG path
 * trong hệ tọa độ viewBox 24x24).
 * Câu chữ "Xxx" trong file là chỗ cần sửa.
 */
interface XxxIconProps {
	className?: string;
	roughConfig?: Options;
}

export function XxxIcon({ className, roughConfig = {} }: XxxIconProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const [isDrawn, setIsDrawn] = useState(false);

	// Stringify config để làm dependency (tránh vẽ lại vô ích)
	const configStr = JSON.stringify(roughConfig);

	useEffect(() => {
		if (!svgRef.current) return;

		// Xóa nét cũ trước khi vẽ (Rough.js vẽ imperative, StrictMode chạy effect 2 lần)
		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		// Default + spread override — icon thường truyền màu qua currentColor
		const parsedConfig = JSON.parse(configStr) as Options;
		const options: Options = {
			roughness: 0.5,
			strokeWidth: 1,
			stroke: "currentColor",
			...parsedConfig,
		};

		const rc = rough.svg(svgRef.current);

		// ❗ Thay path bên dưới bằng hình dáng icon mong muốn.
		// Có thể vẽ nhiều node (path/circle/rectangle...) vào cùng 1 svg.
		const node = rc.path("M 12 3 L 21 12 L 12 21 L 3 12 Z", options);
		svgRef.current.appendChild(node);

		// Fade-in sau khi vẽ xong
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