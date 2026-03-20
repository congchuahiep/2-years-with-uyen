import { useEffect, useRef } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface KeyIconProps {
	className?: string;
	roughConfig?: Options;
}

export function KeyIcon({ className, roughConfig = {} }: KeyIconProps) {
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
			"M10.5 9C12.9853 9 15 6.98528 15 4.5C15 2.01472 12.9853 0 10.5 0C8.01475 0 6.00003 2.01472 6.00003 4.5C6.00003 5.38054 6.25294 6.20201 6.69008 6.89574L0.585815 13L3.58292 15.9971L4.99714 14.5829L3.41424 13L5.00003 11.4142L6.58292 12.9971L7.99714 11.5829L6.41424 10L8.10429 8.30995C8.79801 8.74709 9.61949 9 10.5 9ZM10.5 7C11.8807 7 13 5.88071 13 4.5C13 3.11929 11.8807 2 10.5 2C9.11932 2 8.00003 3.11929 8.00003 4.5C8.00003 5.88071 9.11932 7 10.5 7Z",
			{
				roughness: 0.5,
				strokeWidth: 1,
				stroke: "currentColor",
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
