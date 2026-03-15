"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import type { FillStyle } from "@/types/rough";
import cn from "@/utils/cn";

interface RoughBoxProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
	className?: string;
	roughConfig?: Options & { fillStyle?: FillStyle };
	padding?: number;
	shape?: "rectangle" | "circle";
	style?: React.CSSProperties;
}

export const RoughBox: React.FC<RoughBoxProps> = ({
	children,
	className,
	roughConfig = {},
	padding = 20,
	shape = "rectangle",
	style,
	...props
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

		if (!isDrawn) {
			requestAnimationFrame(() => setIsDrawn(true));
		}
	}, [size.width, size.height, configStr, isDrawn, shape]);

	return (
		<div
			{...props}
			className={cn(
				"relative inline-block w-full transition-opacity duration-300",
				!isDrawn ? "opacity-0" : "opacity-100",
				className,
			)}
			style={style}
		>
			{/* Lớp SVG nền bên dưới */}
			<svg
				ref={svgRef}
				width={size.width}
				height={size.height}
				className="absolute top-0 left-0 pointer-events-none -z-10 overflow-visible"
			/>

			{/* Nội dung bên trên */}
			<div
				ref={containerRef}
				style={{ padding: `${padding}px` }}
				className="size-full"
			>
				{children}
			</div>
		</div>
	);
};
