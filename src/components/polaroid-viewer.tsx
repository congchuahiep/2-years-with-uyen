"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Polaroid } from "@/components/ui/polaroid";
import { RoughBox } from "@/components/ui/rough-box";
import type { PolaroidImage } from "@/types/polaroid";
import cn from "@/utils/cn";

export function PolaroidViewer({ images }: { images: PolaroidImage[] }) {
	return (
		<div className="relative w-full h-125 sm:h-full">
			<div className="absolute inset-0 flex items-center justify-center">
				{images.map((image) => (
					<motion.div
						key={image.id}
						style={{
							zIndex: image.zIndex,
							willChange: "transform",
						}}
						initial={{
							x: 0,
							y: 0,
							rotate: image.isLandscape ? 90 : 0,
							scale: 1,
						}}
						animate={{
							x: image.x,
							y: image.y,
							rotate: image.rotation,
							scale: image.scale,
						}}
						exit={{
							x: 0,
							y: 0,
							rotate: image.isLandscape ? 90 : 0,
							scale: 1,
						}}
						transition={{ type: "spring", stiffness: 300, damping: 25 }}
						className={cn("absolute cursor-pointer touch-none")}
					>
						<Polaroid isLandscape={image.isLandscape}>
							<RoughBox className="size-full">
								<Image
									src={image.url}
									alt="Polaroid Preview"
									fill
									className="object-cover -z-50 pointer-events-none"
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
							</RoughBox>
						</Polaroid>
					</motion.div>
				))}
			</div>
		</div>
	);
}
