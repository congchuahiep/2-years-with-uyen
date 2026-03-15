"use client";

import { useState } from "react";
import { Turntable } from "@/components/icon/turntable-icon";
import { MusicSearchBox } from "@/components/music-search-box";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { DeezerTrack } from "@/types/dezzer";

export default function TestPage() {
	const [isModalVisible, setIsModalVisible] = useState(true);
	const [selectedTrack, setSelectedTrack] = useState<DeezerTrack | undefined>(
		undefined,
	);

	const handleTrackSelect = (track: DeezerTrack) => {
		setSelectedTrack(track);
		setIsModalVisible(false);
	};

	return (
		<div className="flex flex-col w-screen h-screen justify-center items-center">
			<button
				type="button"
				onClick={() => setIsModalVisible(true)}
				className="hover:drop-shadow-highlight cursor-pointer"
			>
				<Turntable playingTrack={selectedTrack} className="w-120 h-auto" />
			</button>

			<Modal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
				<MusicSearchBox onTrackSelect={handleTrackSelect} />
			</Modal>
		</div>
	);
}
