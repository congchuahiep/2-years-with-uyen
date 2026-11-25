"use client";

import { createContext } from "react";
import type { ModalContextValue } from "@/shared/types/modal-context";

/**
 * Context chia sẻ trạng thái modal giữa provider và hook.
 *
 * Tách khỏi `ModalProvider` để `useModal` và provider không import lẫn nhau
 * (vòng import runtime), và để file này chỉ chứa một giá trị.
 */
export const ModalContext = createContext<ModalContextValue | undefined>(
  undefined,
);
