"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import cn from "@/utils/cn";
import { RoughBox } from "./rough-box";

interface ImageUploadResponse {
	previewUrls: string[];
	files: File[];
}

interface ImageUploadProps {
	maxImages?: number;
	onImagesChange: (data: ImageUploadResponse) => void;
	className?: string;
}

export function ImageUpload({
	maxImages = 5,
	onImagesChange,
	className,
}: ImageUploadProps) {
	const [images, setImages] = useState<
		{ file: File; id: string; url: string }[]
	>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;

		// Calculate how many more images we can add
		const remainingSlots = maxImages - images.length;
		const allowedFiles = files.slice(0, remainingSlots);

		const newImages = allowedFiles.map((file) => ({
			file,
			id: Math.random().toString(36).substring(7),
			url: URL.createObjectURL(file),
		}));

		const updatedImages = [...images, ...newImages];
		setImages(updatedImages);

		// Notify parent component
		onImagesChange({
			previewUrls: updatedImages.map((img) => img.url),
			files: updatedImages.map((img) => img.file),
		});

		// Clear file input value to allow selecting the same file again if needed
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const removeImage = (idToRemove: string) => {
		const updatedImages = images.filter((img) => img.id !== idToRemove);

		// Revoke object URL to avoid memory leaks
		const removedImage = images.find((img) => img.id === idToRemove);
		if (removedImage) {
			URL.revokeObjectURL(removedImage.url);
		}

		setImages(updatedImages);

		// Notify parent component
		onImagesChange({
			previewUrls: updatedImages.map((img) => img.url),
			files: updatedImages.map((img) => img.file),
		});
	};

	return (
		<div className={cn("space-y-4", className)}>
			{/* Grid preview images */}
			{images.length > 0 && (
				<div className="flex flex-wrap gap-4">
					{images.map((img) => (
						<RoughBox
							key={img.id}
							padding={0}
							roughConfig={{ roughness: 1.2, strokeWidth: 1.5 }}
							className="inline-block! w-[120px] aspect-square group relative shrink-0"
						>
							<div className="w-full h-full relative p-2">
								<Image
									src={img.url}
									alt="Preview"
									fill
									className="object-cover p-2"
								/>
								<button
									type="button"
									onClick={() => removeImage(img.id)}
									className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 translate-x-1/4 -translate-y-1/4"
									title="Remove image"
								>
									×
								</button>
							</div>
						</RoughBox>
					))}
				</div>
			)}

			{/* Nút Upload Button (ẩn đi nếu đã tối đa) */}
			{images.length < maxImages && (
				<div>
					<input
						type="file"
						accept="image/*"
						multiple
						className="hidden"
						ref={fileInputRef}
						onChange={handleFileChange}
					/>
					{/** biome-ignore lint/a11y/noStaticElementInteractions: No */}
					{/** biome-ignore lint/a11y/useKeyWithClickEvents: No */}
					<div
						className="inline-block cursor-pointer"
						onClick={() => fileInputRef.current?.click()}
					>
						<RoughBox
							padding={0}
							roughConfig={{
								roughness: 1,
								strokeWidth: 1.5,
								stroke: "currentColor",
							}}
						>
							<div className="px-6 py-4 flex flex-col items-center justify-center text-foreground/70 hover:text-foreground transition-colors gap-2 border-dashed border-2 border-transparent">
								<span className="text-2xl">+</span>
								<span className="text-sm font-medium">
									Thêm ảnh ({images.length}/{maxImages})
								</span>
							</div>
						</RoughBox>
					</div>
				</div>
			)}
		</div>
	);
}
