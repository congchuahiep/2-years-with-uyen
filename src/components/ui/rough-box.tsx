"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import type { FillStyle } from "@/types/rough";
import cn from "@/utils/cn";

interface RoughBoxProps {
	children: React.ReactNode;
	className?: string;
	roughConfig?: Options & { fillStyle?: FillStyle };
	padding?: number;
}

export const RoughBox: React.FC<RoughBoxProps> = ({
	children,
	className,
	roughConfig = {},
	padding = 20,
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

		// Sử dụng ResizeObserver để lắng nghe thay đổi kích thước của nội dung
		const resizeObserver = new ResizeObserver(updateSize);
		resizeObserver.observe(containerRef.current);

		updateSize();
		return () => resizeObserver.disconnect();
	}, []);

	useEffect(() => {
		if (!svgRef.current || size.width === 0 || size.height === 0) return;

		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		const rc = rough.svg(svgRef.current);
		const node = rc.rectangle(2, 2, size.width - 4, size.height - 4, {
			roughness: 1.5,
			strokeWidth: 2,
			fillStyle: "solid",
			...roughConfig,
		});

		svgRef.current.appendChild(node);

		if (!isDrawn) {
			requestAnimationFrame(() => setIsDrawn(true));
		}
	}, [size, roughConfig, isDrawn]);

	return (
		<div
			className={cn(
				"relative inline-block w-full transition-opacity duration-700",
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

			{/* Nội dung bên trên */}
			<div ref={containerRef} style={{ padding: `${padding}px` }}>
				{children}
			</div>
		</div>
	);
};
