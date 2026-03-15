"use client";

import { motion, type PanInfo } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LongArrowIcon } from "@/components/icon/long-arrow-icon";
import { Polaroid } from "@/components/ui/polaroid";
import type { PolaroidImage } from "@/types/polaroid";
import { playSound } from "@/utils/audio";
import cn from "@/utils/cn";
import { RoughBox } from "./rough-box";

interface PolaroidItem extends PolaroidImage {
	file: File;
}

interface ImageUploadResponse {
	metadata: PolaroidImage[];
	files: File[];
}

interface PolaroidBoardProps {
	maxImages?: number;
	onImagesChange: (data: ImageUploadResponse) => void;
	className?: string;
}

function ToolbarButton({
	onClick,
	disabled,
	title,
	isActive,
	icon,
	roughConfig,
	className,
}: {
	onClick: () => void;
	disabled?: boolean;
	title: string;
	isActive?: boolean;
	icon: React.ReactNode;
	roughConfig?: React.ComponentProps<typeof RoughBox>["roughConfig"];
	className?: string;
}) {
	const onClickHandler = () => {
		if (disabled) return;
		playSound("pop");
		onClick();
	};

	return (
		<button
			type="button"
			onClick={onClickHandler}
			disabled={disabled}
			title={title}
			className={cn(
				"size-8 cursor-pointer flex items-center justify-center",
				"transition-opacity duration-150 group-hover/polaroid:opacity-100 opacity-0",
				isActive && "opacity-100",
				disabled && "group-hover/polaroid:opacity-50 cursor-not-allowed",
				className,
			)}
		>
			<RoughBox
				padding={0}
				className="size-full"
				roughConfig={
					roughConfig || {
						roughness: 1,
						strokeWidth: 1.5,
						fill: "white",
						fillStyle: "solid",
					}
				}
			>
				<span
					className={cn(
						"flex items-center justify-center size-full text-lg font-bold",
					)}
				>
					{icon}
				</span>
			</RoughBox>
		</button>
	);
}

export function PolaroidBoard({
	maxImages = 5,
	onImagesChange,
	className,
}: PolaroidBoardProps) {
	const [images, setImages] = useState<PolaroidItem[]>([]);
	const [maxZIndex, setMaxZIndex] = useState<number>(10);
	const boardRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Sync with parent whenever images change
	// biome-ignore lint/correctness/useExhaustiveDependencies: Kệ
	useEffect(() => {
		onImagesChange({
			metadata: images.map(({ file, ...meta }) => meta),
			files: images.map((img) => img.file),
		});
	}, [images]); // trigger on change state (not full precise but works fine here)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;

		const remainingSlots = maxImages - images.length;
		const allowedFiles = files.slice(0, remainingSlots);

		let newZIndex = maxZIndex;

		const newImages: PolaroidItem[] = allowedFiles.map((file, index) => {
			newZIndex += 1;
			// Nếu mảng hiện tại rỗng và đây là ảnh đầu tiên, mặc định là Main Photo
			const isFirstImg = images.length === 0 && index === 0;
			return {
				id: Math.random().toString(36).substring(7),
				file,
				url: URL.createObjectURL(file),
				rotation: 0,
				x: Math.random() * 40 - 20, // Spread out a bit
				y: Math.random() * 40 - 20,
				scale: 1,
				isLandscape: false,
				isMain: isFirstImg,
				zIndex: newZIndex,
			};
		});

		setMaxZIndex(newZIndex);
		setImages((prev) => [...prev, ...newImages]);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const removeImage = (idToRemove: string) => {
		setImages((prev) => {
			const updated = prev.filter((img) => img.id !== idToRemove);
			const removed = prev.find((img) => img.id === idToRemove);
			if (removed) URL.revokeObjectURL(removed.url);

			// Nếu xoá mất tấm Main Photo hiện tại, tự động gán cho tấm ảnh đầu tiên còn lại (nếu có)
			if (removed?.isMain && updated.length > 0) {
				updated[0].isMain = true;
			}
			return updated;
		});
	};

	const bringToFront = (id: string) => {
		setMaxZIndex((prev) => {
			const nextZ = prev + 1;
			setImages((imgs) =>
				imgs.map((img) => (img.id === id ? { ...img, zIndex: nextZ } : img)),
			);
			return nextZ;
		});
	};

	const handleDragEnd = (id: string, info: PanInfo) => {
		setImages((imgs) =>
			imgs.map((img) => {
				if (img.id !== id) return img;

				let newX = img.x + info.offset.x;
				let newY = img.y + info.offset.y;

				// Tính toán clamp để ảnh không văng khỏi boardRef trong db metadata
				if (boardRef.current) {
					const board = boardRef.current;
					const maxW = board.offsetWidth / 2 - 100; // Polaroid w ~ 200
					const maxH = board.offsetHeight / 2 - 120; // Polaroid h ~ 250
					newX = Math.max(-maxW, Math.min(newX, maxW));
					newY = Math.max(-maxH, Math.min(newY, maxH));
				}

				return { ...img, x: newX, y: newY };
			}),
		);
	};

	const setMainPhoto = (id: string) => {
		setImages((imgs) => imgs.map((img) => ({ ...img, isMain: img.id === id })));
	};

	const toggleLandscape = (id: string) => {
		setImages((imgs) =>
			imgs.map((img) =>
				img.id === id ? { ...img, isLandscape: !img.isLandscape } : img,
			),
		);
	};

	const changeScale = (id: string, direction: "up" | "down") => {
		setImages((imgs) =>
			imgs.map((img) => {
				if (img.id !== id) return img;
				// Giới hạn scale từ 0.7 đến 1.5
				const delta = direction === "up" ? 0.1 : -0.1;
				const newScale = Math.min(Math.max(img.scale + delta, 0.7), 1.5);
				return { ...img, scale: newScale };
			}),
		);
	};

	const changeRotation = (id: string, direction: "left" | "right") => {
		setImages((imgs) =>
			imgs.map((img) => {
				if (img.id !== id) return img;
				// Mỗi lần xoay 15 độ
				const delta = direction === "right" ? 7.5 : -7.5;
				return { ...img, rotation: img.rotation + delta };
			}),
		);
	};

	return (
		<div className="size-full relative">
			<RoughBox
				padding={32}
				className={cn(
					"size-full flex items-center justify-center relative",
					className,
				)}
				roughConfig={{
					roughness: 2.5,
					strokeWidth: 3,
					stroke: "var(--color-amber-900)",
					fill: "var(--color-amber-100)", // Corkboard color
					fillStyle: "cross-hatch",
					fillWeight: 8,
				}}
			>
				<input
					type="file"
					accept="image/*"
					multiple
					className="hidden"
					ref={fileInputRef}
					onChange={handleFileChange}
				/>

				<div
					ref={boardRef}
					className="absolute inset-4 sm:inset-8 z-0 overflow"
				/>

				{/* Tooltip cho Board */}
				<div className="absolute bottom-4 left-4 z-50 flex items-center gap-2">
					<RoughBox
						padding={0}
						className="w-8 h-8 rounded-full"
						roughConfig={{
							roughness: 1.5,
							strokeWidth: 1.5,
							stroke: "var(--color-purple-600)",
							fill: "var(--color-purple-200)",
							fillStyle: "solid",
						}}
					>
						<span
							className={cn(
								"flex items-center justify-center size-full text-lg",
							)}
						>
							★
						</span>
					</RoughBox>
					<p className="text-purple-600">
						Ảnh chính, ảnh này sẽ được hiển thị ở bìa
					</p>
				</div>

				{images.length === 0 && (
					<div
						className={cn(
							"absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
							"z-50 text-yellow-700 text-center flex flex-col items-center",
							"pointer-events-none",
						)}
					>
						<h2 className="font-bold text-2xl">Khung ghim ảnh</h2>
						<p>Hãy chọn ít nhất 1 tấm ảnh</p>
						<div
							className={cn(
								"absolute top-[120%] mt-4 left-3/7 w-24 h-24 sm:w-32 sm:h-32",
								" text-yellow-700/60",
							)}
							style={{ transform: "rotate(8deg)" }}
						>
							<LongArrowIcon
								className="w-full h-full"
								roughConfig={{ strokeWidth: 2.5, roughness: 1, bowing: 2 }}
							/>
						</div>
					</div>
				)}

				{/* Nút Upload Góc Dưới Chữ */}
				<button
					type="button"
					onClick={() =>
						images.length < maxImages && fileInputRef.current?.click()
					}
					disabled={images.length >= maxImages}
					className={cn(
						"absolute bottom-4 right-4 z-50 group",
						"flex flex-col items-center gap-1 disabled:opacity-50",
						"cursor-pointer active:scale-95 transition-transform",
					)}
				>
					<RoughBox
						padding={0}
						className="size-14"
						roughConfig={{
							roughness: 1.5,
							stroke: "var(--color-amber-900)",
							fill: "var(--color-yellow-200)",
							fillStyle: "solid",
						}}
					>
						<div
							className={cn(
								"flex size-full items-center justify-center",
								"font-bold text-2xl text-amber-900",
								"group-hover:scale-110 transition-transform",
							)}
						>
							+
						</div>
					</RoughBox>
					<div
						className={cn(
							"bg-white/80 px-2 py-0.5 rounded",
							"text-xs font-bold text-amber-900",
						)}
					>
						{images.length}/{maxImages} Ảnh
					</div>
				</button>
			</RoughBox>

			{images.length > 0 && (
				<div
					className={cn(
						"absolute inset-0 z-10 pointer-events-none p-4 sm:p-8",
						"flex items-center justify-center overflow",
					)}
				>
					{images.map((img) => (
						<motion.div
							key={img.id}
							drag
							dragConstraints={boardRef}
							dragMomentum={false}
							dragElastic={0.5}
							whileTap={{ scale: img.scale * 1.05 }}
							whileDrag={{ scale: img.scale * 1.05, cursor: "grabbing" }}
							onDragStart={() => bringToFront(img.id)}
							onDragEnd={(_, info) => handleDragEnd(img.id, info)}
							style={{ zIndex: img.zIndex, willChange: "transform" }}
							animate={{
								x: img.x,
								y: img.y,
								rotate: img.rotation,
								scale: img.scale,
							}}
							transition={{ type: "spring", stiffness: 300, damping: 25 }}
							className={cn(
								"absolute pointer-events-auto group/polaroid",
								"cursor-grab touch-none",
							)}
						>
							<Polaroid isLandscape={img.isLandscape}>
								<RoughBox className="size-full">
									<Image
										src={img.url}
										alt="Polaroid Preview"
										fill
										className="object-cover -z-50 pointer-events-none"
									/>
								</RoughBox>
							</Polaroid>

							{/* Toolbar Buttons (Hover to show) */}
							<div
								className={cn(
									"absolute -top-4 -left-4 flex flex-col items-center gap-1",
									"transition-opacity z-20",
								)}
							>
								<ToolbarButton
									onClick={() => setMainPhoto(img.id)}
									title="Đặt làm ảnh chính"
									isActive={img.isMain}
									icon={img.isMain ? "★" : "☆"}
									roughConfig={{
										roughness: 1.5,
										strokeWidth: 1.5,
										stroke: img.isMain
											? "var(--color-purple-600)"
											: "var(--color-gray-500)",
										fill: img.isMain ? "var(--color-purple-200)" : "white",
										fillStyle: "solid",
									}}
								/>

								<ToolbarButton
									onClick={() => toggleLandscape(img.id)}
									title="Đổi chiều dọc/ngang"
									icon="↺"
								/>

								<ToolbarButton
									onClick={() => changeScale(img.id, "up")}
									disabled={img.scale >= 1.5}
									title="Phóng to"
									icon="+"
								/>

								<ToolbarButton
									onClick={() => changeScale(img.id, "down")}
									disabled={img.scale <= 0.7}
									title="Thu nhỏ"
									icon="-"
								/>

								<ToolbarButton
									onClick={() => changeRotation(img.id, "left")}
									title="Xoay Trái"
									icon="↩"
								/>

								<ToolbarButton
									onClick={() => changeRotation(img.id, "right")}
									title="Xoay Phải"
									icon="↪"
								/>

								<ToolbarButton
									onClick={() => removeImage(img.id)}
									title="Gỡ ghim ảnh này"
									icon="×"
									className="text-red-500"
									roughConfig={{
										roughness: 1.5,
										strokeWidth: 1.5,
										stroke: "var(--color-red-500)",
										fill: "var(--color-red-200)",
										fillStyle: "solid",
									}}
								/>
							</div>
						</motion.div>
					))}
				</div>
			)}
		</div>
	);
}
