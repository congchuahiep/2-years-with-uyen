"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Turntable } from "@/components/icon/turntable-icon";
import { PolaroidViewer } from "@/components/polaroid-viewer";
import Float from "@/components/ui/float";
import { Modal } from "@/components/ui/modal";
import { RoughBox } from "@/components/ui/rough-box";
import { dezzerApi } from "@/configs/api";
import { dezzerEndpoint } from "@/configs/endpoint";
import type { DeezerTrack } from "@/types/dezzer";
import type { RichMoment } from "@/types/moment";
import cn from "@/utils/cn";

interface ModalMomentDetailContentProps {
	moment: RichMoment;
}

export function ModalMomentDetailView({
	moment,
}: ModalMomentDetailContentProps) {
	const router = useRouter();
	const [isModalVisible, setIsModalVisible] = useState(true);
	const audioRef = useRef<HTMLAudioElement>(null);

	const { data: trackData, isSuccess: isFetchTrackSuccess } = useQuery({
		queryKey: ["deezer-track", moment.music_track?.id],
		queryFn: async () => {
			if (!moment.music_track?.id) return null;
			const { data } = await dezzerApi.get(
				dezzerEndpoint.track(moment.music_track.id.toString()),
			);
			return data as DeezerTrack;
		},
		enabled: !!moment.music_track,
		staleTime: 1000 * 60 * 10,
	});

	useEffect(() => {
		if (isFetchTrackSuccess && trackData?.preview) {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
			}

			const audio = new Audio(trackData.preview);
			audioRef.current = audio;
			audio.play().catch((err) => {
				console.error("Auto-play bị chặn bởi trình duyệt:", err);
			});
		}

		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
				audioRef.current = null;
			}
		};
	}, [isFetchTrackSuccess, trackData]);

	const handleClose = () => {
		setIsModalVisible(false);
		setTimeout(() => router.back(), 300);
	};

	return (
		<Modal isOpen={isModalVisible} onClose={handleClose}>
			{/* Khung ảnh */}
			<motion.div
				className={cn(
					"absolute top-1/2 left-1/3 translate-x-1/2 -translate-y-1/2",
					"z-50",
				)}
				initial={{ y: 50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: 50, opacity: 0 }}
			>
				{moment.images && moment.images.length > 0 && (
					<PolaroidViewer images={moment.images} />
				)}
			</motion.div>

			{/* Thông tin */}
			<motion.div
				initial={{ y: 50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: 50, opacity: 0 }}
				transition={{ type: "spring", bounce: 0, duration: 0.3 }}
				className={cn(
					"fixed z-0 top-1/2 right-1/3 translate-x-1/2 -translate-y-1/2",
					"w-lg bg-transparent gap-0",
				)}
			>
				<div className="p-4 sm:p-6 order-2">
					<RoughBox
						roughConfig={{
							bowing: 2,
							roughness: 1.5,
							strokeWidth: 1.5,
							fillStyle: "solid",
							stroke: "transparent",
							fill:
								moment.letter_color === "beige"
									? "var(--color-amber-50)"
									: `var(--color-${moment.letter_color}-200)`,
						}}
						padding={32}
						className="size-full h-120"
					>
						<article className="size-full overflow-y-auto">
							<header className="mb-8 border-b-2 pb-4">
								<h1 className="mb-4 text-3xl font-bold">{moment.title}</h1>
								<div className="flex items-center gap-3 text-base text-stone-500">
									{moment.author.avatar_url && (
										<Image
											src={moment.author.avatar_url}
											alt={moment.author.first_name || ""}
											width={40}
											height={40}
											className="rounded-full size-10 border-2 border-slate-200 p-0.5 object-cover"
										/>
									)}
									<span className="font-semibold">
										{moment.author.last_name} {moment.author.first_name}
									</span>
									<span>&bull;</span>
									<time dateTime={moment.event_date}>
										{new Date(moment.event_date).toLocaleDateString("vi-VN", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</time>
								</div>
							</header>

							{moment.content && <p className="lead">{moment.content}</p>}
						</article>
					</RoughBox>
				</div>
			</motion.div>

			{moment.music_track && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<Float
						speed={0.2}
						amplitude={[10, 10, 10]}
						rotationRange={[10, 10, 5]}
					>
						<Turntable
							playingTrack={moment.music_track}
							className="size-72 absolute left-8 bottom-4 -rotate-12 brightness-90"
						/>
					</Float>
				</motion.div>
			)}
		</Modal>
	);
}
