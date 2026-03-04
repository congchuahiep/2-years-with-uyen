"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import type { FillStyle } from "@/types/rough";
import cn from "@/utils/cn";

interface RoughTagProps {
	children?: React.ReactNode;
	className?: string;
	holeOffset?: number;
	roughConfig?: Options & { fillStyle?: FillStyle };
	padding?: {
		top?: number;
		right?: number;
		bottom?: number;
		left?: number;
	};
	headWidth?: number; // Độ dài của phần đầu nhọn thẻ tag
}

export const RoughTag: React.FC<RoughTagProps> = ({
	children,
	className,
	holeOffset = 0,
	roughConfig = {},
	padding = { top: 8, right: 16, bottom: 8, left: 24 },
	headWidth = 20,
}) => {
	const [isDrawn, setIsDrawn] = useState(false);

	const svgRef = useRef<SVGSVGElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		if (!containerRef.current) return;

		const updateSize = () => {
			if (containerRef.current) {
				const { offsetWidth, offsetHeight } = containerRef.current;
				setSize({ width: offsetWidth, height: offsetHeight });
			}
		};

		const resizeObserver = new ResizeObserver(updateSize);
		resizeObserver.observe(containerRef.current);

		updateSize();
		return () => resizeObserver.disconnect();
	}, []);

	const configStr = JSON.stringify(roughConfig);

	useEffect(() => {
		if (!svgRef.current || size.width === 0 || size.height === 0) return;

		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		const parsedConfig = JSON.parse(configStr);
		const rc = rough.svg(svgRef.current);

		const options = {
			roughness: 1.5,
			strokeWidth: 2,
			fillStyle: "solid",
			...parsedConfig,
		};

		// Kích thước của Tag dãn theo độ dài văn bản
		const W = size.width - 2;
		const H = size.height - 2;

		// Tâm và bán kính của lỗ đục xỏ dây thẻ
		const cx = headWidth / 2 + 8 + holeOffset;
		const cy = H / 2;
		const r = 6;

		// Vẽ Compound Path để điền (Fill) đa giác nhưng trừ (Hole) cái lỗ ở giữa.
		// Đường viền Outer xoay cùng chiều kim đồng hồ (Clockwise):
		const outerPath = `M 2 ${H / 2} L ${headWidth} 2 L ${W} 2 L ${W} ${H} L ${headWidth} ${H} Z`;

		// Đường viền lỗ đục (Inner) xoay ngược chiều kim đồng hồ (Counter-Clockwise):
		// Cấu trúc vẽ 1 hình tròn bằng 2 nửa vòng cung (Arc) M x (y-r) A r r 0 1 0 x (y+r) A r r 0 1 0 x (y-r)
		const innerPath = `M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx} ${cy + r} A ${r} ${r} 0 1 0 ${cx} ${cy - r}`;

		// Kết hợp hai chuỗi SVG Path và nạp vào hàm rough.path()
		const compoundPathStr = `${outerPath} ${innerPath}`;
		const node = rc.path(compoundPathStr, options);
		svgRef.current.appendChild(node);

		// Ngay khi SVG gen xong thì bật hiệu ứng xuất hiện. Gánh delay nhẹ của AnimationFrame
		if (!isDrawn) {
			requestAnimationFrame(() => setIsDrawn(true));
		}
	}, [size.width, size.height, configStr, isDrawn, headWidth, holeOffset]);

	// Hợp nhất padding mặc định với props padding (nếu người dùng override vài giá trị)
	const mergedPadding = {
		top: padding.top ?? 8,
		right: padding.right ?? 16,
		bottom: padding.bottom ?? 8,
		left: padding.left ?? 24,
	};

	return (
		<div
			className={cn(
				"relative inline-block w-fit transition-opacity duration-300",
				!isDrawn ? "opacity-0" : "opacity-100",
				className,
			)}
		>
			{/* Lớp SVG nền bên dưới */}
			<svg
				ref={svgRef}
				width={size.width}
				height={size.height}
				className="absolute top-0 left-0 pointer-events-none -z-10 overflow-visible"
			/>

			{/* Nội dung vùng chứa chữ */}
			<div
				ref={containerRef}
				style={{
					paddingTop: `${mergedPadding.top}px`,
					paddingRight: `${mergedPadding.right}px`,
					paddingBottom: `${mergedPadding.bottom}px`,
					paddingLeft: `${mergedPadding.left + headWidth}px`,
				}}
				className="size-full flex items-center justify-center font-bold"
			>
				{children}
			</div>
		</div>
	);
};
