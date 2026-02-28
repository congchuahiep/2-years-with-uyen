"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";
import cn from "@/utils/cn";

interface SpinnerProps {
	size?: number;
	strokeWidth?: number;
	stroke?: string;
	className?: string;
	roughness?: number;
}

export function Spinner({
	size = 32,
	strokeWidth = 3,
	className,
	roughness = 0.5,
}: SpinnerProps) {
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if (!svgRef.current) return;

		const svg = svgRef.current;
		const rc = rough.svg(svg);
		let animationFrameId: number;
		let phase = 0;

		const draw = () => {
			// Dọn dẹp SVG trước khi vẽ frame mới
			while (svg.firstChild) svg.removeChild(svg.firstChild);

			const points: [number, number][] = [];
			const steps = 240; // Số lượng điểm để vẽ đường cong mượt
			const frequency = 8; // Số lượng cánh hoa
			const amplitude = size * 0.12; // Độ cao của sóng xoắn
			const radius = size / 2 - (strokeWidth + amplitude + 2);
			const cx = size / 2;
			const cy = size / 2;
			const arcAngle = Math.PI * 2;

			for (let i = 0; i <= steps; i++) {
				const angle = (i / steps) * arcAngle;
				// Công thức hình sin kèm theo biến phase để các đỉnh sóng chạy tịnh tiến theo cung tròn
				const r = radius + Math.sin(angle * frequency - phase) * amplitude;
				const x = cx + r * Math.cos(angle);
				const y = cy + r * Math.sin(angle);
				points.push([x, y]);
			}

			// Vẽ đường curve từ danh sách các điểm đã tính toán (những cánh hoa cúc)
			const node = rc.curve(points, {
				stroke: "white",
				strokeWidth,
				roughness,
			});
			svg.appendChild(node);

			// Vẽ nhụy hoa cúc màu vàng nằm đè lên trên ở chính giữa
			const dotNode = rc.circle(cx, cy, size * 0.32, {
				fill: "var(--color-yellow)",
				fillStyle: "solid",
				stroke: "transparent",
				roughness: roughness,
			});
			svg.appendChild(dotNode);

			// Tăng phase lên một lượng nhỏ sau mỗi frame.
			// Số này càng lớn sóng chạy càng nhanh.
			phase += 0.1;
			animationFrameId = requestAnimationFrame(draw);
		};

		draw();

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [size, strokeWidth, roughness]);

	return (
		<svg
			ref={svgRef}
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			className={cn("overflow-visible", className)}
		/>
	);
}
