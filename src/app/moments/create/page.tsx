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
import cn from "@/utils/cn";
import { type CreateMomentState, createMoment } from "./actions";
import { DoorOutIcon } from "@/components/icon/door-out";
import { RoughNotation } from "react-rough-notation";
import { useSafeBack } from "@/hooks/use-safe-back";

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
		<div className="flex flex-col h-screen items-center justify-center px-2 gap-4 relative">
			<Button
				// onClick={() => safeBack()}
				className="absolute top-4 left-4"
				fill="var(--color-red-300)"
				perspective="left"
				buttonSize="small"
			>
				<DoorOutIcon className="size-5" />
				Thôi, không tạo nữa
			</Button>

			<div className="text-start text-4xl font-bold w-full max-w-5xl text-purple-900">
				<RoughNotation
					type="highlight"
					color="var(--color-green-300)"
					show
					padding={-1}
				>
					Tạo kỉ niệm
				</RoughNotation>
			</div>
			<form
				action={handleSubmit}
				className={cn(
					"flex flex-col md:flex-row items-stretch gap-6",
					"w-full max-w-5xl",
				)}
			>
				{/* Input ẩn để gửi Metadata JSON */}
				<input type="hidden" name="metadata" value={JSON.stringify(metadata)} />

				{/* Cột Trái: Bảng ghim ảnh Polaroid */}
				<div className="w-full md:w-3/5 flex flex-col gap-2 z-10">
					<PolaroidBoard
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
					className="w-full md:w-2/5 z-10"
					roughConfig={{
						roughness: 4,
						stroke: "transparent",
						strokeWidth: 2.5,
						fill: "var(--color-purple-200)",
						fillStyle: "zigzag",
						fillWeight: 12,
					}}
				>
					<div className="flex flex-col gap-6 justify-center">
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
								className="h-full min-h-[150px]"
								roughConfig={{
									roughness: 2,
									strokeWidth: 2.5,
									fill: "var(--color-green-50)",
									fillStyle: "zigzag",
									fillWeight: 8,
								}}
							/>
						</div>

						{/* Trạng thái công khai */}
						<div className="flex flex-col gap-2 w-full">
							<label htmlFor="status" className="text-lg font-bold">
								Chia sẻ với
							</label>
							<Select
								id="status"
								name="status"
								disabled={isPending}
								defaultValue="private"
								roughConfig={{
									roughness: 2,
									strokeWidth: 2.5,
									fill: "var(--color-green-50)",
									fillStyle: "zigzag",
									fillWeight: 6,
								}}
							>
								<option value="private">Chỉ 2 đứa mình (Riêng tư)</option>
								<option value="public">Cả thế giới (Công khai)</option>
								<option value="draft">Để sau hẵng tính (Bản nháp)</option>
							</Select>
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

						{/* Cảnh báo lỗi */}

						{/* Nút Submit */}
						<div className="mt-4 flex justify-start gap-2">
							{state?.error && <ErrorMessageBox>{state.error}</ErrorMessageBox>}
							<Button
								type="submit"
								disabled={isPending || selectedFiles.length === 0}
								className="w-full xl:w-auto ml-auto"
								fill="var(--color-sky-300)"
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
					</div>
				</RoughBox>
			</form>
		</div>
	);
}
