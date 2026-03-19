import { useEffect, useRef } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface LockIconProps {
	className?: string;
	roughConfig?: Options;
}

export function LockIcon({ className, roughConfig = {} }: LockIconProps) {
	const svgRef = useRef<SVGSVGElement>(null);

	const configStr = JSON.stringify(roughConfig);

	useEffect(() => {
		if (!svgRef.current) return;

		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		const rc = rough.svg(svgRef.current);
		const parsedConfig = JSON.parse(configStr);

		const node = rc.path(
			// Mũi tên uốn lượn kiểu chữ S mềm mại chỉ xuống dưới
			"M4 6V4C4 1.79086 5.79086 0 8 0C10.2091 0 12 1.79086 12 4V6H14V16H2V6H4ZM6 4C6 2.89543 6.89543 2 8 2C9.10457 2 10 2.89543 10 4V6H6V4ZM7 13V9H9V13H7Z",
			{
				roughness: 0.5,
				strokeWidth: 1,
				stroke: "var(--color-slate-700)",
				fill: "var(--color-slate-200)",
				fillStyle: "solid",
				...parsedConfig,
			},
		);

		svgRef.current.appendChild(node);
	}, [configStr]);

	return (
		<svg
			ref={svgRef}
			viewBox="0 0 16 16"
			className={cn("w-16 h-16 overflow-visible inline-block", className)}
		/>
	);
}
