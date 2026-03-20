"use client";

import type React from "react";
import {
	useEffect,
	useRef,
	useState,
	forwardRef,
	useImperativeHandle,
} from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import type { FillStyle } from "@/types/rough";
import cn from "@/utils/cn";

interface RoughBoxProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
	className?: string;
	backgroundClassName?: string;
	containerClassName?: string;
	roughConfig?: Options & { fillStyle?: FillStyle };
	padding?: number;
	shape?: "rectangle" | "circle";
	style?: React.CSSProperties;
}

// Sử dụng forwardRef để nhận ref từ bên ngoài
export const RoughBox = forwardRef<HTMLDivElement, RoughBoxProps>(
	(
		{
			children,
			className,
			backgroundClassName,
			containerClassName,
			roughConfig = {},
			padding = 20,
			shape = "rectangle",
			style,
			...props
		},
		ref,
	) => {
		const [isDrawn, setIsDrawn] = useState(false);
		const svgRef = useRef<SVGSVGElement>(null);

		// Ref nội bộ dùng để đo kích thước và thực hiện logic vẽ
		const internalRef = useRef<HTMLDivElement>(null);
		const [size, setSize] = useState({ width: 0, height: 0 });

		// Đồng bộ ref bên ngoài với internalRef
		useImperativeHandle(ref, () => internalRef.current!);

		useEffect(() => {
			if (!internalRef.current) return;

			const updateSize = () => {
				if (internalRef.current) {
					const { offsetWidth, offsetHeight } = internalRef.current;
					setSize({ width: offsetWidth, height: offsetHeight });
				}
			};

			const resizeObserver = new ResizeObserver(updateSize);
			resizeObserver.observe(internalRef.current);

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
				ref={internalRef} // Gán ref nội bộ vào đây
				className={cn(
					"relative inline-block w-full transition-opacity duration-300 z-0",
					!isDrawn ? "opacity-0" : "opacity-100",
					className,
				)}
				style={style}
			>
				<svg
					ref={svgRef}
					width={size.width}
					height={size.height}
					className={cn(
						"absolute top-0 left-0 pointer-events-none -z-10 overflow-visible",
						backgroundClassName,
					)}
				/>

				<div
					style={{ padding: `${padding}px` }}
					className={cn("size-full", containerClassName)}
				>
					{children}
				</div>
			</div>
		);
	},
);

// Đặt tên hiển thị cho component (tốt cho debugging)
RoughBox.displayName = "RoughBox";
