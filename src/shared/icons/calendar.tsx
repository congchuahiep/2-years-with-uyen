"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/shared/utils/cn";

interface CalendarIconProps {
	className?: string;
	roughConfig?: Options;
}

export function CalendarIcon({
	className,
	roughConfig = {},
}: CalendarIconProps) {
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
			roughness: 0.7,
			strokeWidth: 1,
			stroke: "currentColor",
			...parsedConfig,
		};

		// 1. Đế lịch (hình thang phía dưới) — vẽ trước để nằm dưới cùng
		const baseNode = rc.polygon(
			[
				[4, 21],
				[20, 21],
				[22, 23],
				[2, 23],
			],
			{
				...options,
				fill: "var(--color-amber-100)",
				fillStyle: "solid",
			},
		);

		// 2. Khung lịch chính (hình chữ nhật tròn góc)
		const bodyNode = rc.rectangle(3, 5, 18, 16, {
			...options,
			fill: "white",
			fillStyle: "solid",
		});

		// 3. Phần header (dải ngang phía trên) — tô màu đậm
		const headerNode = rc.rectangle(3, 5, 18, 4.5, {
			...options,
			fill: "var(--color-red-300)",
			fillStyle: "solid",
		});

		// 4. Đường phân cách header / thân lịch
		const dividerNode = rc.line(3, 9.5, 21, 9.5, options);

		// 5. Hai vòng xỏ dây phía trên (2 hình tròn nhỏ)
		const ringLeftNode = rc.circle(8, 5, 2.5, {
			...options,
			fill: "white",
			fillStyle: "solid",
		});
		const ringRightNode = rc.circle(16, 5, 2.5, {
			...options,
			fill: "white",
			fillStyle: "solid",
		});

		// 6. Hai dây xỏ cong lên phía trên vòng (tạo cảm giác spiral binding)
		const wireLeftNode = rc.arc(8, 5, 2.5, 1.8, Math.PI, 2.2 * Math.PI, true, {
			...options,
			strokeWidth: 1,
		});
		const wireRightNode = rc.arc(16, 5, 2.5, 1.8, Math.PI, 2.2 * Math.PI, true, {
			...options,
			strokeWidth: 1,
		});

		// 7. Lưới ô ngày trong thân lịch (3x3 = 9 ô) — vẽ bằng các đường thẳng
		const gridLines: ReturnType<typeof rc.line>[] = [];
		// 2 đường dọc
		gridLines.push(rc.line(9, 9.5, 9, 21, options));
		gridLines.push(rc.line(15, 9.5, 15, 21, options));
		// 2 đường ngang
		gridLines.push(rc.line(3, 13.5, 21, 13.5, options));
		gridLines.push(rc.line(3, 17.5, 21, 17.5, options));

		// Thứ tự z-index: đế -> khung -> header -> divider -> vòng -> dây -> lưới
		svgRef.current.appendChild(baseNode);
		svgRef.current.appendChild(bodyNode);
		svgRef.current.appendChild(headerNode);
		svgRef.current.appendChild(dividerNode);
		svgRef.current.appendChild(ringLeftNode);
		svgRef.current.appendChild(ringRightNode);
		svgRef.current.appendChild(wireLeftNode);
		svgRef.current.appendChild(wireRightNode);
		gridLines.forEach((node) => {
			svgRef.current?.appendChild(node);
		});

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
