"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import cn from "@/utils/cn";
import { RoughBox } from "./rough-box";

interface AvatarUploadProps {
	name: string;
	defaultUrl: string | null;
	className?: string;
}

export function AvatarUpload({
	name,
	defaultUrl,
	className,
}: AvatarUploadProps) {
	const [previewUrl, setPreviewUrl] = useState<string | null>(defaultUrl);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const newPreviewUrl = URL.createObjectURL(file);
		setPreviewUrl(newPreviewUrl);
	};

	const triggerFileSelect = () => fileInputRef.current?.click();

	return (
		<div className="flex flex-col items-center gap-4">
			<input
				type="file"
				accept="image/*"
				className="hidden"
				name={name}
				ref={fileInputRef}
				onChange={handleFileChange}
			/>
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: kệ */}
			{/** biome-ignore lint/a11y/noStaticElementInteractions: kệ */}
			<div
				className={cn("relative size-32", className)}
				onClick={triggerFileSelect}
			>
				<RoughBox
					padding={0}
					roughConfig={{
						roughness: 1.5,
						strokeWidth: 2,
						// fill: "var(--color-slate-100)",
						fillStyle: "solid",
					}}
					shape="circle"
					className="size-full overflow cursor-pointer"
				>
					{previewUrl ? (
						<Image
							src={previewUrl}
							alt="Avatar preview"
							fill
							className="object-cover -z-10 rounded-full"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-slate-400">
							<span className="text-4xl">+</span>
						</div>
					)}
				</RoughBox>
			</div>
			<button
				type="button"
				onClick={triggerFileSelect}
				className="text-sm font-semibold text-amber-600 hover:text-amber-700"
			>
				Thay đổi ảnh
			</button>
		</div>
	);
}
