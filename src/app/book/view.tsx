"use client";

import { Book } from "@/components/book/book";
import { ErrorMessageBox } from "@/components/ui/error-message-box";
import { RoughBox } from "@/components/ui/rough-box";
import { Spinner } from "@/components/ui/spinner";
import { useFlipBook } from "@/hooks/use-flipbook";

/**
 * Trang `/book` — hiển thị cuốn sổ lật (FlipBook) từ dữ liệu Supabase.
 * Dữ liệu được lấy qua hook `useFlipBook` (TanStack Query).
 */
export default function BookView() {
	const { data, isLoading, isError, error } = useFlipBook();

	// Đang tải dữ liệu
	if (isLoading) {
		return (
			<div className="flex flex-col items-center gap-4 text-purple-100 font-bold">
				<Spinner size={44} />
				<p>Đang mở sổ...</p>
			</div>
		);
	}

	// Lỗi tải dữ liệu
	if (isError) {
		return (
			<ErrorMessageBox className="max-w-md">
				{error?.message ?? "Không thể tải cuốn sổ. Vui lòng thử lại sau."}
			</ErrorMessageBox>
		);
	}

	// Sổ chưa có trang nào
	if (!data || data.pages.length === 0) {
		return (
			<RoughBox
				className="max-w-md text-purple-100 text-center"
				padding={32}
				roughConfig={{
					fill: "var(--color-purple-300)",
					stroke: "var(--color-purple-100)",
					strokeWidth: 2,
					roughness: 1.5,
				}}
			>
				<p className="font-display text-2xl font-bold">Sổ còn trống!</p>
				<p className="mt-2 text-sm font-semibold opacity-90">
					Hãy tạo một khoảnh khắc đầu tiên rồi quay lại đây nhé 💕
				</p>
			</RoughBox>
		);
	}

	return (
		<div className="flex w-full max-w-5xl flex-col items-center">
			<Book pages={data.pages} />
		</div>
	);
}