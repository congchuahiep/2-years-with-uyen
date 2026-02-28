"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import cn from "@/utils/cn";

export function MuteButton({ className }: { className?: string }) {
	const [isMuted, setIsMuted] = useState(false);
	const [isDrawn, setIsDrawn] = useState(false);
	const svgRef = useRef<SVGSVGElement>(null);

	// Load initial state from localStorage
	useEffect(() => {
		const savedMuted = localStorage.getItem("system-muted") === "true";
		setIsMuted(savedMuted);
	}, []);

	// Draw the button using rough.js
	useEffect(() => {
		if (!svgRef.current) return;

		const svg = svgRef.current;
		const rc = rough.svg(svg);

		// Clear previous drawings
		while (svg.firstChild) svg.removeChild(svg.firstChild);

		const size = 48;
		const center = size / 2;
		const radius = (size - 8) / 2;

		// Draw circular background
		const circle = rc.circle(center, center, radius * 2, {
			stroke: "currentColor",
			strokeWidth: 2,
			fill: isMuted ? "var(--color-red)" : "var(--color-background)",
			fillStyle: "zigzag",
			fillWeight: 8,
			roughness: 1.5,
		});

		svg.appendChild(circle);

		if (!isDrawn) {
			setIsDrawn(true);
		}
	}, [isMuted, isDrawn]);

	const toggleMute = () => {
		const newState = !isMuted;
		setIsMuted(newState);
		localStorage.setItem("system-muted", String(newState));

		// Dispatch a custom event to notify other potential listeners (optional)
		window.dispatchEvent(new Event("storage"));
	};

	return (
		<motion.button
			whileTap={{ scale: 0.9 }}
			transition={{ duration: 0.15 }}
			onClick={toggleMute}
			className={cn(
				"relative p-0 border-none cursor-pointer focus:outline-none",
				"transition-opacity duration-500",
				!isDrawn && "opacity-0",
				className,
			)}
			aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
		>
			<svg
				ref={svgRef}
				width="48"
				height="48"
				viewBox="0 0 48 48"
				className="overflow-visible"
			/>
			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				{isMuted ? (
					<VolumeMutedIcon className="w-6 h-6 text-red-600" />
				) : (
					<VolumeIcon className="w-6 h-6 text-primary-600" />
				)}
			</div>
		</motion.button>
	);
}

function VolumeIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<title>Volume On</title>
			<path d="M11 5L6 9H2v6h4l5 4V5z" />
			<path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
			<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
		</svg>
	);
}

function VolumeMutedIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<title>Volume Muted</title>
			<path d="M11 5L6 9H2v6h4l5 4V5z" />
			<line x1="23" y1="9" x2="17" y2="15" />
			<line x1="17" y1="9" x2="23" y2="15" />
		</svg>
	);
}
