"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import type { DeezerTrack } from "@/types/dezzer";
import cn from "@/utils/cn";
import { RoughTag } from "../ui/rough-tag";

interface TurntableProps {
	className?: string;
	playingTrack?: DeezerTrack;
}

export function Turntable({ className, playingTrack }: TurntableProps) {
	const baseBottomRef = useRef<SVGSVGElement>(null);
	const recordRef = useRef<SVGSVGElement>(null);
	const baseTopRef = useRef<SVGSVGElement>(null);

	const [isDrawn, setIsDrawn] = useState(false);

	useEffect(() => {
		if (!baseBottomRef.current || !recordRef.current || !baseTopRef.current)
			return;

		const rcBottom = rough.svg(baseBottomRef.current);
		const rcRecord = rough.svg(recordRef.current);
		const rcTop = rough.svg(baseTopRef.current);

		// Clear existing
		while (baseBottomRef.current.firstChild)
			baseBottomRef.current.removeChild(baseBottomRef.current.firstChild);
		while (recordRef.current.firstChild)
			recordRef.current.removeChild(recordRef.current.firstChild);
		while (baseTopRef.current.firstChild)
			baseTopRef.current.removeChild(baseTopRef.current.firstChild);

		const config: Options = {
			roughness: 0.6,
			strokeWidth: 2,
			stroke: "var(--color-slate-800)",
		};

		// Lớp 1: Thân máy (nằm dưới cùng)
		const body = rcBottom.rectangle(5, 5, 120, 110, {
			...config,
			fill: "var(--color-amber-100)",
			fillStyle: "solid",
			bowing: 1,
		});
		const bodyTop = rcBottom.rectangle(0, 0, 165, 120, {
			...config,
			fill: "var(--color-blue-300)",
			fillStyle: "solid",
			roughness: 0.8,
		});

		baseBottomRef.current.appendChild(bodyTop);
		baseBottomRef.current.appendChild(body);

		// Lớp 2: Đĩa than (sẽ được xoay)
		const platter = rcRecord.circle(65, 60, 100, {
			...config,
			roughness: 0.2,
			fill: "var(--color-slate-700)",
			fillStyle: "solid",
			hachureAngle: 60,
			hachureGap: 3,
			stroke: "none",
		});
		const groove1 = rcRecord.circle(65, 60, 80, {
			...config,
			stroke: "var(--color-slate-600)",
			strokeWidth: 1,
			roughness: 0.5,
		});
		const groove2 = rcRecord.circle(65, 60, 60, {
			...config,
			stroke: "var(--color-slate-600)",
			strokeWidth: 1,
			roughness: 0.5,
		});
		recordRef.current.appendChild(platter);
		recordRef.current.appendChild(groove1);
		recordRef.current.appendChild(groove2);

		// Nhãn đĩa - hiển thị ảnh nếu có recordImageUrl, nếu không thì hiển thị màu xanh lá mặc định
		if (playingTrack) {
			const defs = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"defs",
			);
			const clipPathId = `record-label-clip-${Math.random().toString(36).substr(2, 9)}`;
			const clipPath = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"clipPath",
			);
			clipPath.setAttribute("id", clipPathId);
			const circle = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"circle",
			);
			circle.setAttribute("cx", "65");
			circle.setAttribute("cy", "60");
			circle.setAttribute("r", "15");
			clipPath.appendChild(circle);
			defs.appendChild(clipPath);

			const image = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"image",
			);
			image.setAttribute("href", playingTrack.album.cover_medium);
			image.setAttribute("x", "50");
			image.setAttribute("y", "45");
			image.setAttribute("width", "30");
			image.setAttribute("height", "30");
			image.setAttribute("clip-path", `url(#${clipPathId})`);
			image.setAttribute("preserveAspectRatio", "xMidYMid slice");

			recordRef.current.appendChild(defs);
			recordRef.current.appendChild(image);
		} else {
			const spindle = rcTop.circle(65, 60, 5, {
				...config,
				fill: "var(--color-slate-800)",
				fillStyle: "solid",
			});
			const recordLabel = rcRecord.circle(65, 60, 30, {
				...config,
				roughness: 0.5,
				fill: "var(--color-green-200)",
				fillStyle: "solid",
			});
			recordRef.current.appendChild(recordLabel);
			recordRef.current.appendChild(spindle);
		}

		// Lớp 3: Các chi tiết nổi (nằm trên cùng)
		const armBase = rcTop.circle(145, 20, 20, {
			...config,
			fill: "var(--color-amber-300)",
			fillStyle: "solid",
		});
		const tonearm = rcTop.curve(
			[
				[145, 20],
				[120, 65],
				[95, 70],
			],
			{ ...config, strokeWidth: 5, roughness: 0.5 },
		);
		const headshell = rcTop.rectangle(90, 67, 15, 8, {
			...config,
			roughness: 0.5,
			fill: "var(--color-slate-400)",
			fillStyle: "solid",
		});
		const knob1 = rcTop.circle(20, 20, 10, {
			...config,
			roughness: 0.2,
			fill: "var(--color-slate-700)",
			fillStyle: "solid",
		});
		const knob2 = rcTop.circle(20, 100, 10, {
			...config,
			roughness: 0.2,
			fill: "var(--color-slate-700)",
			fillStyle: "solid",
		});
		const knob3 = rcTop.circle(110, 20, 10, {
			...config,
			roughness: 0.2,
			fill: "var(--color-slate-700)",
			fillStyle: "solid",
		});
		const knob4 = rcTop.circle(110, 100, 10, {
			...config,
			roughness: 0.2,
			fill: "var(--color-slate-700)",
			fillStyle: "solid",
		});
		const powerButton = rcTop.circle(145, 100, 12, {
			...config,
			fill: "var(--color-slate-700)",
			fillStyle: "solid",
		});
		const sliderBg = rcTop.rectangle(137, 50, 16, 40, {
			...config,
			fill: "var(--color-blue-400)",
			fillStyle: "solid",
		});
		const slider = rcTop.rectangle(135, 65, 20, 8, {
			...config,
			fill: "var(--color-amber-300)",
			fillStyle: "solid",
			strokeWidth: 1.5,
		});

		baseTopRef.current.appendChild(armBase);
		baseTopRef.current.appendChild(tonearm);
		baseTopRef.current.appendChild(headshell);
		baseTopRef.current.appendChild(knob1);
		baseTopRef.current.appendChild(knob2);
		baseTopRef.current.appendChild(knob3);
		baseTopRef.current.appendChild(knob4);
		baseTopRef.current.appendChild(powerButton);
		baseTopRef.current.appendChild(sliderBg);
		baseTopRef.current.appendChild(slider);

		if (!isDrawn) {
			requestAnimationFrame(() => setIsDrawn(true));
		}
	}, [isDrawn, playingTrack]);

	return (
		<div className={cn("relative aspect-4/3", className)}>
			{!!playingTrack && (
				<RoughTag
					className="absolute top-4 left-0 z-50 -rotate-12"
					roughConfig={{ roughness: 0.5, fill: "var(--color-rose-300)" }}
				>
					{playingTrack.title}
				</RoughTag>
			)}

			{/* Hiệu ứng nốt nhạc bay lên khi đang phát nhạc */}
			{!!playingTrack && (
				<div className="absolute top-1/3 left-1/2 rotate-12 pointer-events-none z-40">
					{[
						{ id: 1, char: "♪", x: -30, y: -150, duration: 2.1, delay: 0 },
						{ id: 2, char: "♫", x: 40, y: -170, duration: 2.4, delay: 0.6 },
						{ id: 3, char: "♪", x: 10, y: -140, duration: 1.8, delay: 1 },
						{ id: 4, char: "♪", x: 20, y: -150, duration: 1.6, delay: 1.2 },
					].map((note) => (
						<motion.div
							key={note.id}
							className="absolute text-2xl font-bold text-slate-100 drop-shadow-sm"
							initial={{ opacity: 0, y: 0, x: 0, scale: 0.5, rotate: 0 }}
							animate={{
								opacity: [0, 1, 0],
								y: note.y,
								x: note.x,
								scale: [0.5, 1.2, 0.8],
								rotate: [0, 15, -15, 0],
							}}
							transition={{
								duration: note.duration,
								repeat: Infinity,
								delay: note.delay,
								ease: "easeOut",
							}}
						>
							{note.char}
						</motion.div>
					))}
				</div>
			)}

			{/* Lớp 1: Nền tĩnh */}
			<svg
				ref={baseBottomRef}
				viewBox="0 0 165 120"
				className={cn(
					"absolute inset-0 w-full h-full overflow-visible transition-opacity duration-300",
					!isDrawn ? "opacity-0" : "opacity-100",
				)}
			/>

			{/* Lớp 2: Đĩa than xoay */}
			<motion.svg
				ref={recordRef}
				viewBox="0 0 165 120"
				className={cn(
					"absolute inset-0 w-full h-full overflow-visible transition-opacity duration-300",
					!isDrawn ? "opacity-0" : "opacity-100",
				)}
				animate={{ rotate: playingTrack ? 360 : 0 }}
				transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
				style={{
					transformOrigin: "40% 50%", // Tọa độ (95, 75) trên viewBox 200x150
				}}
			/>

			{/* Lớp 3: Các chi tiết tĩnh đè lên trên */}
			<svg
				ref={baseTopRef}
				viewBox="0 0 165 120"
				className={cn(
					"absolute inset-0 w-full h-full overflow-visible transition-opacity duration-300 pointer-events-none",
					!isDrawn ? "opacity-0" : "opacity-100",
				)}
			/>
		</div>
	);
}
