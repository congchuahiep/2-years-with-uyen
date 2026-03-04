"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface SucculentIconProps {
	className?: string;
	roughConfig?: Options;
}

export function SucculentIcon({
	className,
	roughConfig = {},
}: SucculentIconProps) {
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
			roughness: 1,
			strokeWidth: 1,
			stroke: "currentColor",
			...parsedConfig,
		};

		// 1. Chậu cây (Nhìn từ trên xuống là 1 hình tròn to màu nâu đất)
		const potNode = rc.circle(50, 50, 110, {
			...options,
			fill: parsedConfig.fill || "var(--color-amber-50)",
			fillStyle: "solid",
			roughness: 0.5,
		});
		const dirtNode = rc.circle(50, 50, 94, {
			...options,
			fill: parsedConfig.fill || "var(--color-yellow-950)",
			fillStyle: "solid",
			roughness: 0.5,
		});
		svgRef.current.appendChild(potNode);
		svgRef.current.appendChild(dirtNode);

		// Lớp lá ngoài cùng (8 lá to màu mọng nước sẫm xám)
		for (let i = 0; i < 8; i++) {
			const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
			// Rotate quanh tâm cup 50x50
			g.setAttribute("transform", `rotate(${i * 45}, 50, 50)`);

			// Mảnh lá nhọn vươn ra (1 chiếc chĩa về hướng 12h: đỉnh y=0)
			const leafNode = rc.path("M 50 50 Q 30 20 50 0 Q 70 20 50 50 Z", {
				...options,
				fill: "var(--color-emerald-500)",
				fillStyle: "solid",
			});
			g.appendChild(leafNode);
			svgRef.current.appendChild(g);
		}

		// Lớp lá giữa, sole 22.5 độ so với lớp ngoài và cánh thu nhỏ về 10
		for (let i = 0; i < 8; i++) {
			const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
			g.setAttribute("transform", `rotate(${i * 45 + 22.5}, 50, 50)`);

			const leafNode = rc.path("M 50 50 Q 35 25 50 10 Q 65 25 50 50 Z", {
				...options,
				fill: "var(--color-emerald-300)",
				fillStyle: "solid",
			});
			g.appendChild(leafNode);
			svgRef.current.appendChild(g);
		}

		// Lớp lá chốt bên trong cùng, so le 10 độ, 4 lá nhỏ, cánh vươn xa tí là 20
		for (let i = 0; i < 4; i++) {
			const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
			g.setAttribute("transform", `rotate(${i * 90 + 10}, 50, 50)`);

			const leafNode = rc.path("M 50 50 Q 40 32 50 20 Q 60 32 50 50 Z", {
				...options,
				fill: "var(--color-lime-400)",
				fillStyle: "solid",
			});
			g.appendChild(leafNode);
			svgRef.current.appendChild(g);
		}

		if (!isDrawn) {
			requestAnimationFrame(() => setIsDrawn(true));
		}
	}, [configStr, isDrawn]);

	return (
		<svg
			ref={svgRef}
			viewBox="0 0 100 100"
			className={cn(
				"overflow-visible inline-block transition-opacity duration-300",
				!isDrawn ? "opacity-0" : "opacity-100",
				className,
			)}
		/>
	);
}
