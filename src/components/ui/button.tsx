"use client";

import { motion, useAnimation } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { FillStyle } from "@/types/rough";
import { playSound } from "@/utils/audio";
import cn from "@/utils/cn";

const depthY = 8;
// Độ lệch trục X dùng cho 'left' và 'right'
const offsetAmount = 8;
// Độ tóp đỉnh dùng cho 'center'
const insetX = 14;

export function Button({
	children,
	className,
	fill = "var(--color-primary)",
	perspective = "center",
	buttonSize = "normal",
	disabled,
	...props
}: Omit<
	React.ComponentPropsWithoutRef<"button">,
	| "onAnimationStart"
	| "onAnimationEnd"
	| "onAnimationIteration"
	| "onDrag"
	| "onDragStart"
	| "onDragEnd"
	| "onDragOver"
	| "onDragEnter"
	| "onDragLeave"
	| "onDragExit"
> & {
	fill?: string;
	buttonSize?: "normal" | "small";
	perspective?: "left" | "center" | "right";
}) {
	const controls = useAnimation();

	const [isDrawn, setIsDrawn] = useState(false);
	const svgBaseRef = useRef<SVGSVGElement>(null);
	const svgFrontRef = useRef<SVGSVGElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });
	const [isPressed, setIsPressed] = useState(false);

	const handleShake = async () => {
		if (disabled) {
			if (navigator.vibrate) navigator.vibrate(50);
			await controls.start({
				x: [0, -4, 4, -4, 4, -4, 4, 0],
				y: [0, -4, 4, -4, 4, -4, 4, 0],
				transition: { duration: 0.3 },
			});
		}
	};

	// CẬP NHẬT KÍCH THƯỚC KHI RENDER
	// - Khi component render lần đầu
	// - Khi component resize
	useEffect(() => {
		if (!containerRef.current) return;
		const updateSize = () => {
			if (containerRef.current) {
				setSize({
					width: containerRef.current.offsetWidth,
					height: containerRef.current.offsetHeight,
				});
			}
		};
		const ro = new ResizeObserver(updateSize);
		ro.observe(containerRef.current);
		updateSize();
		return () => ro.disconnect();
	}, []);

	// Vẽ lại nút mỗi lần có size, fill, perspective hoặc isPressed thay đổi
	useEffect(() => {
		// Mỗi lần bấm nút thì các đường vẽ trên nút sẽ thay đổi, làm cho hiệu ứng
		// animation trở nên ngộ nghĩnh hơn. Nhưng đồng nghĩa với việc hiệu năng
		// sẽ bị giảm đi đôi chút nma quan tâm làm đ gì khi chỉ với 1 nút nhỏ?
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		isPressed;

		if (isPressed && disabled) return;

		if (
			!svgBaseRef.current ||
			!svgFrontRef.current ||
			size.width === 0 ||
			size.height === 0
		)
			return;

		const svgBase = svgBaseRef.current;
		const svgFront = svgFrontRef.current;

		while (svgBase.firstChild) svgBase.removeChild(svgBase.firstChild);
		while (svgFront.firstChild) svgFront.removeChild(svgFront.firstChild);

		const rcBase = rough.svg(svgBase);
		const rcFront = rough.svg(svgFront);

		let depthX = 0;
		if (perspective === "left") depthX = -offsetAmount;
		if (perspective === "right") depthX = offsetAmount;

		const absDx = Math.abs(depthX);
		const absDy = Math.abs(depthY);

		const baseX = depthX < 0 ? absDx + 2 : 2;
		const baseY = depthY < 0 ? absDy + 2 : 2;
		const frontW =
			perspective === "center" ? size.width - 4 : size.width - absDx - 4;
		const frontH =
			perspective === "center"
				? size.height - absDy - 4
				: size.height - absDy - 4;

		// VẼ LỚP NỀN (Mặt đáy + Mặt hông) vào svgBase
		let bottomPoints: [number, number][];
		if (perspective === "center") {
			bottomPoints = [
				[baseX, baseY + frontH],
				[baseX + frontW, baseY + frontH],
				[baseX + frontW - insetX, baseY + frontH + depthY],
				[baseX + insetX, baseY + frontH + depthY],
			];
		} else {
			bottomPoints = [
				[baseX, baseY + frontH],
				[baseX + frontW, baseY + frontH],
				[baseX + frontW + depthX, baseY + frontH + depthY],
				[baseX + depthX, baseY + frontH + depthY],
			];
		}

		svgBase.appendChild(
			rcBase.polygon(bottomPoints, {
				fill: fill,
				fillStyle: "hachure" as FillStyle,
				hachureAngle: 60,
				hachureGap: 3.5,
				strokeWidth: 2.5,
				stroke: disabled
					? "var(--color-muted-foreground)"
					: "var(--color-foreground)",
				roughness: 1.5,
			}),
		);

		if (perspective !== "center" && depthX !== 0) {
			let sidePoints: [number, number][];
			if (perspective === "left") {
				sidePoints = [
					[baseX, baseY],
					[baseX, baseY + frontH],
					[baseX + depthX, baseY + frontH + depthY],
					[baseX + depthX, baseY + depthY],
				];
			} else {
				sidePoints = [
					[baseX + frontW, baseY],
					[baseX + frontW, baseY + frontH],
					[baseX + frontW + depthX, baseY + frontH + depthY],
					[baseX + frontW + depthX, baseY + depthY],
				];
			}
			svgBase.appendChild(
				rcBase.polygon(sidePoints, {
					fill: fill,
					fillStyle: "hachure",
					hachureGap: 3.5,
					stroke: disabled
						? "var(--color-muted-foreground)"
						: "var(--color-foreground)",
					strokeWidth: 2.5,
					roughness: 1.5,
				}),
			);
		}

		// VẼ MẶT CHÍNH vào svgFront (Luôn được vẽ ở vị trí nổi)
		svgFront.appendChild(
			rcFront.rectangle(baseX, baseY, frontW, frontH, {
				fill: isPressed ? `oklch(from ${fill} calc(l - 0.15) c h)` : fill,
				fillStyle: disabled
					? ("cross-hatch" as FillStyle)
					: ("solid" as FillStyle),
				strokeWidth: 2.5,
				stroke: disabled
					? "var(--color-muted-foreground)"
					: "var(--color-foreground)",
				fillWeight: 5,
				roughness: 1.2,
			}),
		);

		if (!isDrawn) {
			requestAnimationFrame(() => setIsDrawn(true));
		}
	}, [size, fill, perspective, isPressed, disabled, isDrawn]);

	// Đoạn code dưới này là dùng cho việc khi người dùng bấm nút
	// (Sẽ đẩy cả Thẻ Chữ bên trong lẫn SVG Tầng nổi)
	let pressTransform = "translate(0, 0)";
	if (isPressed || disabled) {
		if (perspective === "center") {
			pressTransform = `translateY(${depthY - 4}px)`;
		} else if (perspective === "left") {
			pressTransform = `translate(${-offsetAmount + 4}px, ${depthY - 6}px)`;
		} else if (perspective === "right") {
			pressTransform = `translate(${offsetAmount - 4}px, ${depthY - 6}px)`;
		}
	}

	let pxLeft = buttonSize === "small" ? "20px" : "24px";
	let pxRight = buttonSize === "small" ? "20px" : "24px";
	const pxTop = buttonSize === "small" ? "12px" : "16px";
	const pxBottom =
		buttonSize === "small" ? `${depthY + 12}px` : `${depthY + 16}px`;

	if (perspective === "left") {
		pxLeft = `${offsetAmount + 24}px`;
	} else if (perspective === "right") {
		pxRight = `${offsetAmount + 24}px`;
	}

	return (
		<motion.button
			animate={controls}
			whileTap={!disabled ? { scale: 0.95 } : {}}
			onClick={handleShake}
			className={cn(
				"relative inline-flex items-center justify-center select-none transition-opacity duration-500",
				"text-foreground",
				!isDrawn && "opacity-0",
				disabled ? "cursor-not-allowed" : "cursor-pointer",
				className,
			)}
			onMouseDown={(e) => {
				setIsPressed(true);
				playSound(disabled ? "disabled" : "normal");
				props.onMouseDown?.(e);
			}}
			onMouseUp={(e) => {
				setIsPressed(false);
				props.onMouseUp?.(e);
			}}
			onMouseLeave={(e) => {
				setIsPressed(false);
				props.onMouseLeave?.(e);
			}}
			onTouchStart={(e) => {
				setIsPressed(true);
				playSound(disabled ? "disabled" : "normal");
				props.onTouchStart?.(e);
			}}
			onTouchEnd={(e) => {
				setIsPressed(false);
				props.onTouchEnd?.(e);
			}}
			{...props}
		>
			{/* Lớp nền tĩnh (Bóng đổ xéo xuống dưới) */}
			<svg
				ref={svgBaseRef}
				width={size.width}
				height={size.height}
				className={cn(
					"absolute top-0 left-0 pointer-events-none -z-10 overflow-visible",
					disabled && "brightness-90",
				)}
			/>

			{/* Lớp nổi bị dịch chuyển (Mặt chữ nhật trước mặt) */}
			<svg
				ref={svgFrontRef}
				width={size.width}
				height={size.height}
				className={cn(
					"absolute top-0 left-0 pointer-events-none z-0 transition-transform duration-75 overflow-visible",
					disabled && "brightness-90",
				)}
				style={{ transform: pressTransform }}
			/>

			{/* Lớp chứa nội dung chữ (Cũng dịch chuyển đồng bộ với Lớp nổi) */}
			<div
				ref={containerRef}
				className={cn(
					"w-full flex items-center justify-center font-bold relative z-10",
					buttonSize === "small" ? "text-base" : "text-xl",
				)}
				style={{
					paddingLeft: pxLeft,
					paddingRight: pxRight,
					paddingTop: pxTop,
					paddingBottom: pxBottom,
				}}
			>
				<div
					className={cn(
						"transition-transform duration-75 flex items-center gap-2",
						"[&_svg:not([class*='size-'])]:size-6",
					)}
					style={{ transform: pressTransform }}
				>
					{children}
				</div>
			</div>
		</motion.button>
	);
}
