import { useEffect, useRef } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import cn from "@/utils/cn";

interface QuestIconProps {
	className?: string;
	roughConfig?: Options;
}

export function QuestIcon({ className, roughConfig = {} }: QuestIconProps) {
	const svgRef = useRef<SVGSVGElement>(null);

	const configStr = JSON.stringify(roughConfig);

	useEffect(() => {
		if (!svgRef.current) return;

		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		const rc = rough.svg(svgRef.current);
		const parsedConfig = JSON.parse(configStr);

		const map1 = rc.path(
			"M640 213.333333L384 128 128 213.333333v682.666667l256-85.333333 256 85.333333 256-85.333333V128z",
			{
				roughness: 2,
				stroke: "var(--color-purple-600)",
				strokeWidth: 6,
				fill: "var(--color-yellow-200)",
				fillStyle: "solid",
				...parsedConfig,
			},
		);

		const map2 = rc.path("M384 128v682.666667l256 85.333333V213.333333z", {
			roughness: 2,
			stroke: "var(--color-purple-600)",
			strokeWidth: 6,
			fill: "var(--color-yellow-300)",
			fillStyle: "solid",
			...parsedConfig,
		});

		const questMark = rc.path(
			"M590.677333 607.146667c0-24.106667 2.944-43.328 8.832-57.6 5.909333-14.293333 16.704-28.373333 32.448-42.24 15.701333-13.824 26.176-25.130667 31.402667-33.834667 5.205333-8.704 7.786667-17.877333 7.786667-27.541333 0-29.12-13.546667-43.669333-40.618667-43.669334-12.864 0-23.125333 3.925333-30.848 11.754667-7.722667 7.850667-11.776 18.666667-12.117333 32.448H512c0.341333-32.874667 11.072-58.624 32.170667-77.248 21.077333-18.56 49.877333-27.882667 86.336-27.882667 36.821333 0 65.365333 8.832 85.717333 26.496 20.266667 17.642667 30.442667 42.538667 30.442667 74.752 0 14.656-3.285333 28.458667-9.898667 41.450667-6.613333 13.013333-18.154667 27.434667-34.645333 43.285333l-21.077334 19.882667c-13.205333 12.586667-20.757333 27.285333-22.677333 44.181333l-1.045333 15.744h-66.645334z m-7.594666 79.104c0-11.498667 3.968-20.949333 11.882666-28.458667 7.893333-7.445333 18.005333-11.178667 30.336-11.178667s22.442667 3.754667 30.336 11.178667c7.914667 7.509333 11.882667 16.96 11.882667 28.458667 0 11.285333-3.882667 20.650667-11.605333 28.010666-7.744 7.36-17.962667 11.072-30.613334 11.072s-22.869333-3.712-30.634666-11.093333c-7.701333-7.338667-11.584-16.704-11.584-27.989333z",
			{
				roughness: 1,
				strokeWidth: 6,
				stroke: "var(--color-purple-600)",
				fill: "var(--color-purple-600)",
				fillStyle: "zigzag",
				fillWeight: 6,
				...parsedConfig,
			},
		);

		svgRef.current.appendChild(map1);
		svgRef.current.appendChild(map2);
		svgRef.current.appendChild(questMark);
	}, [configStr]);

	return (
		<svg
			ref={svgRef}
			viewBox="0 0 1024 1024"
			className={cn("w-16 h-16 overflow-visible inline-block", className)}
		/>
	);
}
