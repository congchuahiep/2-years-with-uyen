"use client";

import { Book } from "@/components/book/book";
import { PaletteIcon } from "@/shared/icons/palette-icon";
import { ErrorMessageBox } from "@/shared/components/error-message-box";
import { Spinner } from "@/shared/components/spinner";
import { useFlipBook } from "@/hooks/use-flipbook";

/**
 * Trang `/book` — hiển thị cuốn sổ lật (FlipBook) từ dữ liệu Supabase.
 * Dữ liệu được lấy qua hook `useFlipBook` (TanStack Query).
 */
export default function BookView() {
  const { data, status, error } = useFlipBook();

  // Đang tải dữ liệu
  if (status === "pending") {
    return (
      <div className="flex items-center gap-4 text-purple-100 font-bold">
        <Spinner size={32} />
        <p>Đang mở sổ...</p>
      </div>
    );
  }

  // Lỗi tải dữ liệu
  if (status === "error") {
    return (
      <ErrorMessageBox className="max-w-md">
        {error?.message ?? "Không thể tải cuốn sổ. Vui lòng thử lại sau."}
      </ErrorMessageBox>
    );
  }

  return (
    <>
      <div className="flex w-full max-w-5xl flex-col items-center">
        <Book pages={data.pages} />
      </div>
      <Background />{" "}
    </>
  );
}

function Background() {
  return (
    <div className="absolute inset-0 size-full">
      <PaletteIcon
        className="absolute text-purple-800 size-90 -translate-x-1/2 translate-y-1/2 bottom-18 left-32"
        roughConfig={{
          roughness: 0.2,
          fill: "var(--color-amber-200)",
          fillStyle: "solid",
        }}
      />
    </div>
  );
}
