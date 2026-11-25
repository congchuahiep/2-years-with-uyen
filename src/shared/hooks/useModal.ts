"use client";

import { useContext } from "react";
import { ModalContext } from "@/shared/providers/ModalContext";

/**
 * Đọc trạng thái modal từ `ModalProvider`.
 * Ném lỗi khi dùng ngoài provider để phát hiện sớm lỗi lắp ráp.
 */
export default function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal phải được dùng bên trong ModalProvider");
  }
  return context;
}
