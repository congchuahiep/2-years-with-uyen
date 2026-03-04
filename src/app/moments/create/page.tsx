"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorMessageBox } from "@/components/ui/error-message-box";
import { Input } from "@/components/ui/input";
import {
	PolaroidBoard,
	type PolaroidItem,
} from "@/components/ui/polaroid-board";
import { RoughBox } from "@/components/ui/rough-box";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { BinderPaper } from "@/components/ui/binder-paper";
import cn from "@/utils/cn";
import { type CreateMomentState, createMoment } from "./actions";
import { DoorOutIcon } from "@/components/icon/door-out";
import { RoughNotation } from "react-rough-notation";
import { useSafeBack } from "@/hooks/use-safe-back";
import { Switch } from "@/components/ui/switch";
import { RoughTag } from "@/components/ui/rough-tag";
import { StarIcon } from "@/components/icon/star";
import { ShootingStarIcon } from "@/components/icon/shooting-star";
import { HeartIcon } from "@/components/icon/heart";
import { ArrowIcon } from "@/components/icon/arrow";
import { DaisyIcon } from "@/components/icon/daisy";
import { BowIcon } from "@/components/icon/bow";
import { HighlighterIcon } from "@/components/icon/highlighter";
import { PencilIcon } from "@/components/icon/pencil";
import { PenIcon } from "@/components/icon/pen";
import { BrushIcon } from "@/components/icon/brush";
import { MarkerIcon } from "@/components/icon/marker";
import { Polaroid } from "@/components/ui/polaroid";
import { CoffeeIcon } from "@/components/icon/coffee";
import { SucculentIcon } from "@/components/icon/succulent";
import { CameraIcon } from "@/components/icon/camera";

const initialState: CreateMomentState = {
	error: "",
	success: false,
};

export default function CreateMomentPage() {
	const router = useRouter();
	const safeBack = useSafeBack();
	const [state, formAction, isPending] = useActionState(
		createMoment,
		initialState,
	);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [metadata, setMetadata] = useState<Omit<PolaroidItem, "file">[]>([]);

	useEffect(() => {
		if (state?.success) {
			router.push("/");
		}
	}, [state, router]);

	const handleSubmit = (formData: FormData) => {
		// Thêm toàn bộ file ảnh vào formData trước khi gửi đi
		selectedFiles.forEach((file) => {
			formData.append("images", file);
		});

		const _currentDateLocal = new Date().toISOString().slice(0, 16);
		const formEventDate = formData.get("eventDate");
		if (!formEventDate) {
			formData.set("eventDate", _currentDateLocal);
		}

		formAction(formData);
	};

	return (
		<div className="flex flex-col h-screen items-center justify-center relative overflow-hidden">
			<Button
				onClick={() => safeBack()}
				fill="var(--color-red-300)"
				perspective="right"
				buttonSize="small"
				className="absolute top-4 left-4 z-10"
			>
				<DoorOutIcon className="size-5" />
				Thôi, không tạo nữa
			</Button>

			<div className="absolute top-4 right-4 z-10 space-x-2">
				<Button
					fill="var(--color-yellow-300)"
					perspective="left"
					buttonSize="small"
				>
					Lưu nháp
				</Button>
				<Button
					type="submit"
					form="moment-form"
					disabled={isPending || selectedFiles.length === 0}
					className=""
					fill="var(--color-green-300)"
					perspective="left"
					buttonSize="small"
				>
					{isPending ? (
						<>
							<Spinner size={24} /> Đang lưu nè...
						</>
					) : (
						<>Lưu Lại</>
					)}
				</Button>
			</div>

			{/* Nhóm Họa cụ Văn phòng phẩm */}
			<MarkerIcon
				className="absolute -bottom-10 left-8 h-64 text-slate-800 rotate-24 z-0 drop-shadow-xl"
				roughConfig={{ fill: "var(--color-blue-200)" }}
			/>
			<MarkerIcon
				className="absolute -bottom-8 left-30 h-64 text-red-950 rotate-12 z-0 drop-shadow-xl"
				roughConfig={{ fill: "var(--color-red-200)" }}
			/>
			<MarkerIcon
				className="absolute -bottom-10 left-44 h-68 text-purple-950 rotate-16 z-10 drop-shadow-xl"
				roughConfig={{ fill: "var(--color-purple-200)" }}
			/>
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
			<SucculentIcon className="absolute -bottom-32 right-0 size-70 text-slate-800 -rotate-12 z-10 drop-shadow-xl" />

			<StarIcon
				className="absolute bottom-32 -left-4 size-32 text-amber-300 -rotate-12 -z-10"
				roughConfig={{
					fill: "var(--color-amber-200)",
					fillStyle: "solid",
				}}
			/>

			<Polaroid className="absolute top-100 left-0 -rotate-12 scale-70 -z-10 drop-shadow-xl">
				<RoughBox
					className="size-full"
					roughConfig={{ fill: "var(--color-stone-400)" }}
				/>
			</Polaroid>
			<Polaroid className="absolute top-95 left-0 rotate-4 scale-70 -z-10">
				<RoughBox
					className="size-full"
					roughConfig={{ fill: "var(--color-stone-400)" }}
				/>
			</Polaroid>
			<Polaroid className="absolute top-80 left-12 -rotate-6 scale-70 -z-10">
				<RoughBox
					className="size-full"
					roughConfig={{ fill: "var(--color-stone-400)" }}
				/>
			</Polaroid>

			<BinderPaper className="w-full max-w-5xl space-y-4 px-2 h-[80%] z-0">
				<form
					action={handleSubmit}
					id="moment-form"
					className={cn(
						"flex flex-col md:flex-row items-stretch gap-12 h-full",
					)}
				>
					{/* Doodles & Icons trang trí vây quanh trang */}
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
						className="absolute bottom-14 left-[30%] size-16 text-red-500 -rotate-12 z-0"
						roughConfig={{ fill: "var(--color-red-300)" }}
					/>
					<HeartIcon
						className="absolute bottom-14 left-[38%] size-8 text-green-500 rotate-3 z-0"
						roughConfig={{ fill: "var(--color-green-300)" }}
					/>
					<HeartIcon
						className="absolute bottom-22 left-[43%] size-7 text-purple-500 -rotate-6 z-0"
						roughConfig={{ fill: "var(--color-purple-300)" }}
					/>
					<HeartIcon
						className="absolute bottom-20 left-[47%] size-6 text-pink-500 rotate-12 z-0"
						roughConfig={{ fill: "var(--color-pink-300)" }}
					/>
					<ShootingStarIcon
						className="absolute bottom-32 left-1/2 w-16 h-16 text-pink-400 z-30 drop-shadow-sm"
						// roughConfig={{ fill: "var(--color-pink-300)", fillStyle: "hachure" }}
					/>

					{/* Input ẩn để gửi Metadata JSON */}
					<input
						type="hidden"
						name="metadata"
						value={JSON.stringify(metadata)}
					/>

					<RoughTag
						className="text-2xl absolute top-0 -right-8 z-10 rotate-20"
						holeOffset={8}
						padding={{ top: 12, right: 16, bottom: 12, left: 24 }}
						roughConfig={{ fill: "var(--color-pink-100)" }}
					>
						<div className="flex items-center gap-2 font-bold">
							Công khai? <Switch name="status" />
						</div>
					</RoughTag>

					{/* Cột Trái: Bảng ghim ảnh Polaroid */}
					<div className="w-lg h-148 flex flex-col gap-2 z-10 -mt-4">
						<PolaroidBoard
							className="-rotate-6 shadow-md"
							maxImages={5}
							onImagesChange={({ files, metadata }) => {
								setSelectedFiles(files);
								setMetadata(metadata);
							}}
						/>
					</div>

					{/* Cột Phải: Form thông tin */}
					<RoughBox
						padding={24}
						className="w-full md:w-2/5 z-10 self-end rotate-3 translate-2 relative"
						roughConfig={{
							roughness: 4,
							stroke: "transparent",
							strokeWidth: 2.5,
							fill: "var(--color-sky-200)",
							fillStyle: "zigzag",
							fillWeight: 12,
						}}
					>
						<div className="flex flex-col gap-6 justify-center">
							{state?.error && <ErrorMessageBox>{state.error}</ErrorMessageBox>}

							{/*<ErrorMessageBox>
								LỗiLỗiLỗiLỗiLỗiLỗiLỗiLỗiLỗiLỗiLỗiLỗiLỗi
								LỗiLỗiLỗiLỗiLỗiLỗiLỗiLỗiLỗiLỗiLỗiLỗiLỗi
							</ErrorMessageBox>*/}

							{/* Tiêu đề */}
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
									disabled={isPending}
									roughConfig={{
										roughness: 2,
										strokeWidth: 2.5,
										fill: "var(--color-emerald-50)",
										fillStyle: "zigzag",
										fillWeight: 6,
									}}
								/>
							</div>

							{/* Thời gian */}
							<div className="flex flex-col gap-2 w-full">
								<label htmlFor="eventDate" className="text-lg font-bold">
									Xảy ra lúc nào
								</label>
								<Input
									id="eventDate"
									name="eventDate"
									type="datetime-local"
									disabled={isPending}
									defaultValue={new Date().toISOString().slice(0, 16)}
									roughConfig={{
										roughness: 2,
										strokeWidth: 2.5,
										fill: "var(--color-green-50)",
										fillStyle: "zigzag",
										fillWeight: 6,
									}}
								/>
							</div>

							{/* Nội dung */}
							<div className="flex flex-col gap-2">
								<label htmlFor="content" className="text-lg font-bold">
									Kể cho nhau nghe nè
								</label>
								<Textarea
									id="content"
									name="content"
									placeholder="Mọi chuyện bắt đầu từ lúc..."
									disabled={isPending}
									className="h-full min-h-48"
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

				{/*<div className="flex gap-2 justify-end">
					{state?.error && <ErrorMessageBox>{state.error}</ErrorMessageBox>}

					<Button
						type="submit"
						disabled={isPending || selectedFiles.length === 0}
						className=""
						fill="var(--color-sky-300)"
						perspective="right"
						buttonSize="small"
					>
						{isPending ? (
							<>
								<Spinner size={24} /> Đang lưu nè...
							</>
						) : (
							<>Lưu Lại</>
						)}
					</Button>
				</div>*/}
			</BinderPaper>
		</div>
	);
}
