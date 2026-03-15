"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { RoughNotation } from "react-rough-notation";
import { dezzerApi } from "@/configs/api";
import { dezzerEndpoint } from "@/configs/endpoint";
import { useDebounce } from "@/hooks/use-debounce";
import type { DeezerTrack } from "@/types/dezzer";
import cn from "@/utils/cn";
import { PauseIcon } from "./icon/pause-icon";
import { PlayIcon } from "./icon/play-icon";
import { Input } from "./ui/input";
import { RoughBox } from "./ui/rough-box";
import { Spinner } from "./ui/spinner";

interface MusicSearchBoxProps {
	onTrackSelect?: (track: DeezerTrack) => void;
}

export function MusicSearchBox({ onTrackSelect }: MusicSearchBoxProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [activeAudio, setActiveAudio] = useState<HTMLAudioElement | null>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const { data: tracks = [], isLoading } = useQuery({
		queryKey: ["deezer-search", debouncedSearchTerm],
		queryFn: async () => {
			if (!debouncedSearchTerm) return [];
			const response = await dezzerApi.get<{ data: DeezerTrack[] }>(
				dezzerEndpoint.search(debouncedSearchTerm),
			);
			return response.data.data || [];
		},
		enabled: !!debouncedSearchTerm,
	});

	// Cleanup audio when component unmounts or modal closes
	useEffect(() => {
		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
				audioRef.current = null;
			}
		};
	}, []);

	const handleTrackSelected = useCallback(
		(track: DeezerTrack) => {
			if (onTrackSelect) onTrackSelect(track);
		},
		[onTrackSelect],
	);

	// Audio Preview Logic
	const handlePlayPreview = useCallback(
		(track: DeezerTrack) => {
			// Stop any currently playing audio
			if (activeAudio) {
				activeAudio.pause();
				// If clicking the same track, just stop it
				if (activeAudio.src === track.preview) {
					setActiveAudio(null);
					audioRef.current = null;
					return;
				}
			}

			// Play new audio
			const audio = new Audio(track.preview);
			audio.play();
			setActiveAudio(audio);
			audioRef.current = audio;

			// Clean up when audio finishes
			audio.onended = () => {
				setActiveAudio(null);
				audioRef.current = null; // Reset audioRef khi nhạc kết thúc
			};
		},
		[activeAudio],
	);

	// Reset selection on new search
	// biome-ignore lint/correctness/useExhaustiveDependencies: Kệ
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setSelectedIndex(0);
	}, [debouncedSearchTerm]);

	// Keyboard Navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (tracks.length === 0) return;

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setSelectedIndex((prev) => Math.min(prev + 1, tracks.length - 1));
					break;
				case "ArrowUp":
					e.preventDefault();
					setSelectedIndex((prev) => Math.max(prev - 1, 0));
					break;
				case "Enter":
					e.preventDefault();
					if (onTrackSelect && tracks[selectedIndex]) {
						onTrackSelect(tracks[selectedIndex]);
					}
					break;
				case " ": // Ctrl + Space
					if (e.ctrlKey) {
						e.preventDefault();
						if (tracks[selectedIndex]) {
							handlePlayPreview(tracks[selectedIndex]);
						}
					}
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [tracks, selectedIndex, onTrackSelect, handlePlayPreview]);

	// Auto-scroll to selected item
	useEffect(() => {
		if (listRef.current) {
			const selectedItem = listRef.current.children[
				selectedIndex
			] as HTMLElement;
			if (selectedItem) {
				selectedItem.scrollIntoView({
					block: "nearest",
				});
			}
		}
	}, [selectedIndex]);

	return (
		<motion.div
			initial={{ y: 50, opacity: 0, zIndex: 100 }}
			animate={{ y: 0, opacity: 1, zIndex: 100 }}
			exit={{ y: 50, opacity: 0 }}
			transition={{ type: "spring", bounce: 0, duration: 0.3 }}
			className={cn(
				"fixed z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
			)}
		>
			<RoughBox
				className="w-lg h-128"
				roughConfig={{
					stroke: "transparent",
					fill: "var(--color-rose-300)",
					fillStyle: "hachure",
					fillWeight: 8,
				}}
				padding={32}
			>
				<div className="size-full space-y-8">
					<Input
						autoFocus
						placeholder="Gõ tên bài hát..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						roughConfig={{
							roughness: 2,
							strokeWidth: 2.5,
							fill: "var(--color-yellow-100)",
							fillStyle: "zigzag",
							fillWeight: 8,
						}}
					/>

					<div
						ref={listRef}
						className="flex-1 pr-2 -mr-2 space-y-2 h-80 overflow-y-scroll"
					>
						{isLoading ? (
							<div className="flex items-center justify-center h-full">
								<Spinner />
							</div>
						) : tracks.length > 0 ? (
							tracks.map((track, index) => (
								<TrackItem
									key={track.id}
									track={track}
									isSelected={index === selectedIndex}
									isPlaying={
										activeAudio?.src === track.preview && !activeAudio.paused
									}
									onPlay={() => handlePlayPreview(track)}
									onTrackSelect={handleTrackSelected}
								/>
							))
						) : (
							<div className="flex flex-col items-center justify-center h-full text-center text-yellow-100">
								{/*<Music2 className="size-12" />*/}
								<p className="mt-2 font-semibold">
									{debouncedSearchTerm
										? "Chả thấy gì cả :'("
										: "Chọn nhạc đi bồ~"}
								</p>
							</div>
						)}
					</div>

					<div className="flex gap-2 flex-wrap">
						<RoughNotation type="highlight" color="var(--color-stone-200)" show>
							<span className="font-bold">Ctrl + Space</span>
						</RoughNotation>
						để nghe thử,{" "}
						<RoughNotation type="highlight" color="var(--color-stone-200)" show>
							<span className="font-bold">Enter</span>
						</RoughNotation>{" "}
						để chọn bài hát
					</div>
				</div>
			</RoughBox>
		</motion.div>
	);
}

interface TrackItemProps {
	track: DeezerTrack;
	isSelected: boolean;
	isPlaying: boolean;
	onPlay: () => void;
	onTrackSelect: (track: DeezerTrack) => void;
}

function TrackItem({
	track,
	isSelected,
	isPlaying,
	onPlay,
	onTrackSelect,
}: TrackItemProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-4 p-2 rounded-lg",
				isSelected ? "bg-green-400/70" : "bg-transparent hover:bg-rose-400/40",
			)}
		>
			<Image
				src={track.album.cover_small}
				alt={track.album.title}
				width={48}
				height={48}
				className="rounded-md size-12 object-cover"
			/>
			<div className="flex-1 overflow-hidden">
				<p className="font-bold text-yellow-950 truncate">{track.title}</p>
				<p className="text-sm text-rose-100 truncate">{track.artist.name}</p>
			</div>
			<RoughBox
				padding={4}
				shape="circle"
				roughConfig={{
					roughness: 0.5,
					strokeWidth: 1,
					stroke: isSelected ? "var(--color-rose-950)" : "transparent",
					fill: isPlaying ? "var(--color-rose-500)" : "transparent",
					fillStyle: "solid",
				}}
				onClick={onPlay}
				className={cn(
					"rounded-full size-8 z-10",
					"hover:bg-rose-500/50 focus:outline-none focus:ring-2",
					isPlaying ? "text-green-50" : "text-green-50",
					"select-none cursor-pointer",
				)}
				aria-label={isPlaying ? "Pause preview" : "Play preview"}
			>
				{isPlaying ? <PauseIcon /> : <PlayIcon />}
			</RoughBox>

			<button
				type="button"
				className="text-sm hover:bg-yellow-100 px-2 py-1 rounded-full cursor-pointer"
				onClick={() => onTrackSelect(track)}
			>
				Chọn
			</button>
		</div>
	);
}
