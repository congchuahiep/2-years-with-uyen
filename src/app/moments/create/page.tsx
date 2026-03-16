"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackButton } from "@/components/back-button";
import { BowIcon } from "@/components/icon/bow";
import { BrushIcon } from "@/components/icon/brush";
import { CameraIcon } from "@/components/icon/camera";
import { CoffeeIcon } from "@/components/icon/coffee";
import { HeartIcon } from "@/components/icon/heart";
import { MarkerIcon } from "@/components/icon/marker";
import { PencilIcon } from "@/components/icon/pencil";
import { ShootingStarIcon } from "@/components/icon/shooting-star";
import { StarIcon } from "@/components/icon/star";
import { Turntable } from "@/components/icon/turntable-icon";
import { MusicSearchBox } from "@/components/music-search-box";
import { BinderPaper } from "@/components/ui/binder-paper";
import { Button } from "@/components/ui/button";
import { ErrorMessageBox } from "@/components/ui/error-message-box";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Polaroid } from "@/components/ui/polaroid";
import { PolaroidBoard } from "@/components/ui/polaroid-board";
import { RoughBox } from "@/components/ui/rough-box";
import { RoughTag } from "@/components/ui/rough-tag";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	type CreateMomentVariables,
	useCreateMoment,
} from "@/hooks/use-create-moment-mutation";
import type { Color } from "@/types/color";
import type { DeezerTrack } from "@/types/dezzer";
import type { PolaroidImage } from "@/types/polaroid";
import cn from "@/utils/cn";
import { getColor } from "@/utils/color";

const MARKER_DECORATIONS = [
	{
		pos: "-right-8",
		bottom: "-bottom-24",
		rotate: "-rotate-16",
		color: "beige",
	},
	{ pos: "right-8", bottom: "-bottom-30", rotate: "-rotate-12", color: "sky" },
	{
		pos: "right-24",
		bottom: "-bottom-28",
		rotate: "-rotate-16",
		color: "green",
	},
	{
		pos: "right-42",
		bottom: "-bottom-32",
		rotate: "-rotate-8",
		color: "yellow",
	},
	{
		pos: "right-56",
		bottom: "-bottom-30",
		rotate: "-rotate-14",
		color: "purple",
	},
	{ pos: "right-72", bottom: "-bottom-30", rotate: "-rotate-8", color: "red" },
	{ pos: "right-88", bottom: "-bottom-34", rotate: "-rotate-6", color: "blue" },
	{
		pos: "right-100",
		bottom: "-bottom-34",
		rotate: "-rotate-16",
		color: "pink",
	},
	{
		pos: "right-112",
		bottom: "-bottom-34",
		rotate: "-rotate-16",
		color: "orange",
	},
];

export default function CreateMomentPage() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [metadata, setMetadata] = useState<PolaroidImage[]>([]);
	const [letterColor, setLetterColor] = useState<Color>("beige");
	const [selectedTrack, setSelectedTrack] = useState<DeezerTrack | undefined>(
		undefined,
	);

	const [isTrackModalVisible, setIsTrackModalVisible] = useState(false);
	const [formError, setFormError] = useState("");

	const { mutate, isPending: isLoading } = useCreateMoment({
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["moments"] });
			router.push("/");
		},
		onError: (err) => {
			setFormError(
				(err as Error).message || "Đã có một lỗi không mong muốn xảy ra.",
			);
		},
	});

	const handleTrackSelect = (track: DeezerTrack) => {
		setSelectedTrack(track);
		setIsTrackModalVisible(false);
	};

	const handleSubmit = (isDraft: boolean) => {
		const form = document.getElementById("moment-form") as HTMLFormElement;
		if (!form) return;

		const formData = new FormData(form);
		const variables: CreateMomentVariables = {
			title: formData.get("title") as string,
			content: formData.get("content") as string,
			eventDate:
				(formData.get("eventDate") as string) ||
				new Date().toISOString().slice(0, 10),
			isPublic: formData.get("is_public") === "on",
			isDraft: isDraft,
			letterColor: letterColor,
			selectedTrack: selectedTrack,
			selectedFiles: selectedFiles,
			metadata: metadata,
		};

		mutate(variables);
	};

	const hasImages = selectedFiles.length > 0;
	const hasTitle = title.trim() !== "";
	const hasContent = content.trim() !== "";
	const canDraft = hasImages || hasTitle || hasContent;
	const canPublish = hasImages && hasTitle;

	return (
		<div className="flex flex-col h-screen items-center justify-center relative overflow-hidden">
			<BackButton>Thôi, không tạo nữa</BackButton>

			<div className="absolute top-4 right-4 z-10 space-x-2">
				{isLoading ? (
					<RoughBox
						roughConfig={{
							fill: "var(--color-blue-300)",
							stroke: "var(--color-sky-800)",
						}}
						padding={8}
						className="cursor-progress font-bold text-sky-800 select-none"
					>
						<div className="flex gap-2 items-center px-4 py-2">
							<Spinner size={24} /> Đang lưu kỉ niệm...
						</div>
					</RoughBox>
				) : (
					<>
						<Button
							type="submit"
							form="moment-form"
							formAction={() => handleSubmit(true)}
							formNoValidate
							disabled={!canDraft}
							fill="var(--color-yellow-300)"
							perspective="left"
							buttonSize="small"
						>
							Lưu nháp
						</Button>
						<Button
							type="submit"
							form="moment-form"
							disabled={!canPublish}
							fill="var(--color-green-300)"
							perspective="left"
							buttonSize="small"
						>
							Đăng tải
						</Button>
					</>
				)}
			</div>

			<button
				type="button"
				onClick={() => setIsTrackModalVisible(true)}
				className={cn(
					"absolute -bottom-16 left-8 cursor-pointer z-20 rotate-12",
					"drop-shadow-md hover:drop-shadow-highlight",
				)}
			>
				<Turntable playingTrack={selectedTrack} className="w-100 h-auto" />
			</button>

			{MARKER_DECORATIONS.map((marker, index) => (
				<MarkerIcon
					// biome-ignore lint/suspicious/noArrayIndexKey: Static element
					key={index}
					className={cn(
						"absolute h-64 z-10 drop-shadow-xl hover:drop-shadow-highlight",
						"cursor-pointer hover:h-72 transition-all duration-150",
						letterColor === marker.color ? "h-76!" : "",
						marker.pos,
						marker.bottom,
						marker.rotate,
						marker.color === "beige"
							? "text-amber-950"
							: `text-${marker.color}-950`,
					)}
					onClick={() => setLetterColor(marker.color as Color)}
					roughConfig={{
						fill:
							marker.color === "beige"
								? "var(--color-yellow-100)"
								: `var(--color-${marker.color}-300)`,
					}}
				/>
			))}

			<BrushIcon
				className="absolute top-32 -right-10 h-90 text-slate-800 -rotate-15 drop-shadow-md"
				roughConfig={{ stroke: "currentColor" }}
			/>
			<PencilIcon
				className="absolute top-64 right-12 h-64 text-slate-800 -rotate-20 drop-shadow-md"
				roughConfig={{ fill: "var(--color-yellow-300)", fillStyle: "solid" }}
			/>

			<CoffeeIcon className="absolute bottom-48 -right-4 size-60 text-slate-800 rotate-40 z-0 drop-shadow-xl" />
			<CameraIcon
				className="absolute top-24 -left-12 w-80 text-slate-800 -rotate-45 drop-shadow-lg"
				roughConfig={{ fill: "var(--color-slate-300)" }}
			/>
			{/*<SucculentIcon className="absolute top-32 right-0 size-70 text-slate-800 -rotate-12 z-10 drop-shadow-xl" />*/}

			<StarIcon
				className="absolute bottom-32 -left-4 size-32 text-amber-300 -rotate-12 -z-10"
				roughConfig={{
					fill: "var(--color-amber-200)",
					fillStyle: "solid",
				}}
			/>

			<Polaroid className="absolute top-100 left-0 -rotate-12 scale-70 z-0 drop-shadow-xl">
				<RoughBox
					className="size-full"
					roughConfig={{ fill: "var(--color-stone-400)" }}
				/>
			</Polaroid>
			<Polaroid className="absolute top-95 left-0 rotate-4 scale-70 z-0">
				<RoughBox
					className="size-full"
					roughConfig={{ fill: "var(--color-stone-400)" }}
				/>
			</Polaroid>
			<Polaroid className="absolute top-80 left-12 -rotate-6 scale-70 z-0">
				<RoughBox
					className="size-full"
					roughConfig={{ fill: "var(--color-stone-400)" }}
				/>
			</Polaroid>

			<BinderPaper className="w-full max-w-5xl space-y-4 px-2 h-[80%] z-0">
				<form
					action={() => handleSubmit(false)}
					id="moment-form"
					className={cn(
						"flex flex-col md:flex-row items-stretch gap-12 h-full",
					)}
				>
					<StarIcon
						className="absolute top-16 right-[20%] size-16 text-yellow-400 -rotate-12 z-0"
						roughConfig={{
							fill: "var(--color-yellow-200)",
							fillStyle: "solid",
						}}
					/>
					<StarIcon
						className="absolute top-24 right-[27%] size-12 text-yellow-400 rotate-3 z-0"
						roughConfig={{
							fill: "var(--color-yellow-200)",
							fillStyle: "solid",
						}}
					/>
					<BowIcon
						className="absolute top-24 right-[8%] w-24 h-24 text-rose-400 rotate-12 z-0"
						roughConfig={{
							fill: "var(--color-rose-200)",
							fillStyle: "solid",
						}}
					/>
					<HeartIcon
						className="absolute bottom-20 left-[30%] size-16 text-red-500 -rotate-12 z-0"
						roughConfig={{ fill: "var(--color-red-300)" }}
					/>
					<HeartIcon
						className="absolute bottom-20 left-[38%] size-8 text-green-500 rotate-3 z-0"
						roughConfig={{ fill: "var(--color-green-300)" }}
					/>
					<HeartIcon
						className="absolute bottom-28 left-[43%] size-7 text-purple-500 -rotate-6 z-0"
						roughConfig={{ fill: "var(--color-purple-300)" }}
					/>
					<HeartIcon
						className="absolute bottom-26 left-[47%] size-6 text-pink-500 rotate-12 z-0"
						roughConfig={{ fill: "var(--color-pink-300)" }}
					/>
					<ShootingStarIcon className="absolute bottom-32 left-1/2 w-16 h-16 text-pink-400 z-30 drop-shadow-sm" />

					<input
						type="hidden"
						name="metadata"
						value={JSON.stringify(metadata)}
					/>

					<RoughTag
						className="text-2xl absolute top-0 -right-8 z-10 rotate-20 text-pink-900"
						holeOffset={8}
						padding={{ top: 12, right: 16, bottom: 12, left: 24 }}
						roughConfig={{
							fill: "var(--color-pink-100)",
							stroke: "var(--color-pink-900)",
						}}
					>
						<div className="flex items-center gap-2 font-bold">
							Công khai? <Switch name="is_public" />
						</div>
					</RoughTag>

					<RoughBox
						className="absolute bottom-0 left-54 -rotate-2 text-base w-fit max-w-sm"
						padding={12}
						roughConfig={{
							roughness: 2,
							stroke: "transparent",
							fill: "var(--color-yellow-100)",
							fillStyle: "solid",
						}}
					>
						<p className="text-yellow-800">
							*Để đăng tải kỉ niệm, bạn hãy ghim ít nhất một bức hình và thêm
							tên kỉ niệm nhé!
						</p>
					</RoughBox>

					<div className="w-lg h-148 flex flex-col gap-2 z-50 -mt-4">
						<PolaroidBoard
							className="-rotate-6 shadow-md"
							maxImages={5}
							onImagesChange={({ files, metadata }) => {
								setSelectedFiles(files);
								setMetadata(metadata);
							}}
						/>
					</div>

					<RoughBox
						padding={24}
						className={cn(
							"w-full md:w-2/5 z-10 self-end rotate-3 translate-2 relative",
							"drop-shadow-md",
						)}
						roughConfig={{
							roughness: 4,
							stroke: "transparent",
							strokeWidth: 2.5,
							fill: getColor(letterColor),
							fillStyle: "zigzag",
							fillWeight: 12,
						}}
					>
						<div className="flex flex-col gap-6 justify-center">
							{formError && <ErrorMessageBox>{formError}</ErrorMessageBox>}

							<div className="flex flex-col gap-2">
								<label htmlFor="title" className="text-lg font-bold">
									Tên kỷ niệm
								</label>
								<Input
									id="title"
									name="title"
									type="text"
									placeholder="Hôm nay có gì vui thế?"
									required
									disabled={isLoading}
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									roughConfig={{
										roughness: 2,
										strokeWidth: 2.5,
										fill: "var(--color-emerald-50)",
										fillStyle: "zigzag",
										fillWeight: 6,
									}}
								/>
							</div>

							<div className="flex flex-col gap-2 w-full">
								<label htmlFor="eventDate" className="text-lg font-bold">
									Xảy ra lúc nào
								</label>
								<Input
									id="eventDate"
									name="eventDate"
									type="date"
									disabled={isLoading}
									defaultValue={new Date().toISOString().slice(0, 10)}
									roughConfig={{
										roughness: 2,
										strokeWidth: 2.5,
										fill: "var(--color-green-50)",
										fillStyle: "zigzag",
										fillWeight: 6,
									}}
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label htmlFor="content" className="text-lg font-bold">
									Kể cho nhau nghe nè
								</label>
								<Textarea
									id="content"
									name="content"
									placeholder="Mọi chuyện bắt đầu từ lúc..."
									disabled={isLoading}
									className="h-full min-h-48"
									value={content}
									onChange={(e) => setContent(e.target.value)}
									roughConfig={{
										roughness: 2,
										strokeWidth: 2.5,
										fill: "var(--color-green-50)",
										fillStyle: "zigzag",
										fillWeight: 8,
									}}
								/>
							</div>
						</div>
					</RoughBox>
				</form>
			</BinderPaper>

			<Modal
				isOpen={isTrackModalVisible}
				onClose={() => setIsTrackModalVisible(false)}
			>
				<MusicSearchBox onTrackSelect={handleTrackSelect} />
			</Modal>
		</div>
	);
}
