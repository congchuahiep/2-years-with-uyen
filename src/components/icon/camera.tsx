"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface CameraIconProps {
	className?: string;
	roughConfig?: Options;
}

export function CameraIcon({ className, roughConfig = {} }: CameraIconProps) {
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
			roughness: 1.5,
			strokeWidth: 2,
			stroke: "currentColor",
			...parsedConfig,
		};

		// 1. Máy ảnh Vintage từ trên xuống: Khung viền hình chữ nhật bao quanh
		const bodyNode = rc.rectangle(15, 25, 120, 65, {
			...options,
			fill: parsedConfig.fill || "var(--color-slate-200)",
			fillStyle: "solid",
		});

		// Đường bo viền sọc giữa thân phân cách
		const midLine1 = rc.line(15, 45, 135, 45, options);
		const midLine2 = rc.line(15, 50, 135, 50, options);

		// 2. Viewfinder (Kính ngắm/ cục nhô ở trên) bên phải
		const viewfinderNode = rc.rectangle(100, 15, 30, 10, {
			...options,
			fill: "var(--color-slate-400)",
			fillStyle: "solid",
		});

		// 3. Shutter Button (Nút bấm chụp màu đỏ tròn)
		const buttonNode = rc.circle(35, 20, 14, {
			...options,
			fill: "var(--color-red-500)",
			fillStyle: "solid",
		});

		// 4. Flash Box & Cảm biến trên thân máy
		const flashNode = rc.rectangle(110, 30, 15, 10, {
			...options,
			fill: "var(--color-slate-700)",
			fillStyle: "solid",
		});
		const sensorNode = rc.circle(25, 35, 8, {
			...options,
			fill: "var(--color-slate-800)",
			fillStyle: "solid",
		});

		// 5. Ống kính (Lens) trồi lên nằm giữa
		const lensOuter = rc.circle(75, 55, 50, {
			...options,
			fill: "var(--color-slate-700)",
			fillStyle: "solid",
		});

		const lensInner = rc.circle(75, 55, 30, {
			...options,
			fill: "var(--color-slate-900)",
			fillStyle: "solid",
		});

		const lensGlare = rc.circle(80, 50, 10, {
			...options,
			fill: "var(--color-slate-200)",
			fillStyle: "solid",
			stroke: "none",
		});

		// Ghép layer
		svgRef.current.appendChild(viewfinderNode);
		svgRef.current.appendChild(buttonNode);
		svgRef.current.appendChild(bodyNode);
		svgRef.current.appendChild(midLine1);
		svgRef.current.appendChild(midLine2);
		svgRef.current.appendChild(flashNode);
		svgRef.current.appendChild(sensorNode);
		svgRef.current.appendChild(lensOuter);
		svgRef.current.appendChild(lensInner);
		svgRef.current.appendChild(lensGlare);

		if (!isDrawn) {
			requestAnimationFrame(() => setIsDrawn(true));
		}
	}, [configStr, isDrawn]);

	// ViewBox dẹt dài chữ nhật cho hợp hình chữ nhật của Body máy ảnh
	return (
		<svg
			ref={svgRef}
			viewBox="0 0 150 100"
			className={cn(
				"overflow-visible inline-block transition-opacity duration-300",
				!isDrawn ? "opacity-0" : "opacity-100",
				className,
			)}
		/>
	);
}
