"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import type { FillStyle } from "@/types/rough";
import cn from "@/utils/cn";

/**
 * Template container khung viền vẽ tay (bản rút gọn của `ui/rough-box.tsx`).
 *
 * Cách dùng: copy file này, đổi tên component + props, và tùy chỉnh phần vẽ
 * trong useEffect (shape, path, số lớp SVG...) theo nhu cầu.
 * Câu chữ "Xxx" trong file là chỗ cần sửa.
 */
interface XxxBoxProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
	className?: string;
	roughConfig?: Options & { fillStyle?: FillStyle };
	shape?: "rectangle" | "circle";
}

export const XxxBox = ({
	children,
	className,
	roughConfig = {},
	shape = "rectangle",
	...props
}: XxxBoxProps) => {
	const [isDrawn, setIsDrawn] = useState(false);
	const svgRef = useRef<SVGSVGElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	// 1. Đo kích thước thật của container (vẽ lại khi resize)
	useEffect(() => {
		if (!containerRef.current) return;
		const updateSize = () => {
			if (containerRef.current) {
				setSize({
					width: containerRef.current.offsetWidth,
					height: containerRef.current.offsetHeight,
				});
			}
		};
		const ro = new ResizeObserver(updateSize);
		ro.observe(containerRef.current);
		updateSize();
		return () => ro.disconnect();
	}, []);

	// 2. Stringify config để làm dependency (tránh vẽ lại vô ích khi parent re-render)
	const configStr = JSON.stringify(roughConfig);

	// 3. Vẽ lại mỗi khi size / config / shape thay đổi
	useEffect(() => {
		if (!svgRef.current || size.width === 0 || size.height === 0) return;

		// 4. Xóa nét cũ trước khi vẽ (Rough.js vẽ imperative, StrictMode chạy effect 2 lần)
		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		// 5. Default + spread override
		const parsedConfig = JSON.parse(configStr) as Options;
		const options: Options = {
			roughness: 1.5,
			strokeWidth: 2,
			fillStyle: "solid",
			...parsedConfig,
		};

		const rc = rough.svg(svgRef.current);

		// 6. Vẽ inset âm để nét rough tràn ra ngoài không bị cắt
		const node =
			shape === "circle"
				? rc.ellipse(
						size.width / 2,
						size.height / 2,
						size.width - 4,
						size.height - 4,
						options,
					)
				: rc.rectangle(2, 2, size.width - 4, size.height - 4, options);
		svgRef.current.appendChild(node);

		// 7. Fade-in sau khi vẽ xong (chống flash nét trắng)
		if (!isDrawn) {
			requestAnimationFrame(() => setIsDrawn(true));
		}
	}, [size.width, size.height, configStr, shape, isDrawn]);

	return (
		<div
			{...props}
			ref={containerRef}
			className={cn(
				"relative inline-block w-full transition-opacity duration-300 z-0",
				!isDrawn ? "opacity-0" : "opacity-100",
				className,
			)}
		>
			{/* Lớp nét vẽ nằm dưới nội dung */}
			<svg
				ref={svgRef}
				width={size.width}
				height={size.height}
				className="absolute top-0 left-0 pointer-events-none -z-10 overflow-visible"
			/>

			{/* Nội dung — padding do component cha quyết định (xem `padding` trong rough-box.tsx) */}
			<div className="size-full">{children}</div>
		</div>
	);
};