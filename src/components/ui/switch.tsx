"use client";

import { motion } from "motion/react";
import { forwardRef, useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import { playSound } from "@/utils/audio";
import cn from "@/utils/cn";
import { RoughBox } from "./rough-box";

export interface SwitchProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	roughConfig?: Options;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
	(
		{ className, checked = false, onCheckedChange, roughConfig, ...props },
		ref,
	) => {
		const [internalChecked, setInternalChecked] = useState(checked);

		// Sync with prop if it's controlled
		useEffect(() => {
			setInternalChecked(checked);
		}, [checked]);

		const isChecked = onCheckedChange ? checked : internalChecked;

		const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
			playSound("toggle");
			if (onCheckedChange) {
				onCheckedChange(!isChecked);
			} else {
				setInternalChecked(!internalChecked);
			}
			props.onClick?.(e);
		};

		return (
			<button
				type="button"
				role="switch"
				aria-checked={isChecked}
				onClick={handleToggle}
				className={cn(
					"relative h-8 w-14 cursor-pointer outline-none transition-opacity",
					"disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={ref}
				{...props}
			>
				{/* Track SVG */}
				<SwitchTrack checked={isChecked} roughConfig={roughConfig} />

				{/* Thumb */}
				<motion.div
					initial={false}
					animate={{ x: isChecked ? 24 : 0 }}
					transition={{ type: "spring", stiffness: 500, damping: 30 }}
					className="absolute top-1 left-1 h-6 w-6 z-10"
				>
					<RoughBox
						shape="circle"
						padding={0}
						className="size-full"
						roughConfig={{
							roughness: 1,
							strokeWidth: 2.5,
							stroke: "var(--color-amber-900)",
							fill: "white",
							fillStyle: "solid",
						}}
					/>
				</motion.div>
			</button>
		);
	},
);
Switch.displayName = "Switch";

const SwitchTrack = ({
	checked,
	roughConfig,
}: {
	checked: boolean;
	roughConfig?: Options;
}) => {
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if (!svgRef.current) return;
		const rc = rough.svg(svgRef.current);

		while (svgRef.current.firstChild) {
			svgRef.current.removeChild(svgRef.current.firstChild);
		}

		// Tạo đường Path cho hình con nhộng (pill-shape) bằng Cubic Bezier Curves
		const node = rc.path(
			"M 16 2 L 40 2 C 47.7 2, 54 8.3, 54 16 C 54 23.7, 47.7 30, 40 30 L 16 30 C 8.3 30, 2 23.7, 2 16 C 2 8.3, 8.3 2, 16 2 Z",
			{
				roughness: 0.5,
				strokeWidth: 2.5,
				stroke: "var(--color-amber-900)",
				fill: checked ? "var(--color-green-300)" : "var(--color-gray-200)",
				fillStyle: "solid",
				...roughConfig,
			},
		);
		svgRef.current.appendChild(node);
	}, [checked, roughConfig]);

	return (
		<svg
			ref={svgRef}
			viewBox="0 0 56 32"
			className="size-full absolute inset-0 pointer-events-none transition-colors z-0"
		/>
	);
};
