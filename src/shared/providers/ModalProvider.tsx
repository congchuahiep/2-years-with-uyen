"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ModalContext } from "@/shared/providers/ModalContext";

/**
 * Giữ trạng thái "đang có modal mở" cho toàn app.
 * `ModalContentWrapper` dùng trạng thái này để thu nhỏ nền.
 */
export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modalCount, setModalCount] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const registerModal = useCallback(
    () => setModalCount((prev) => prev + 1),
    [],
  );
  const unregisterModal = useCallback(
    () => setModalCount((prev) => Math.max(0, prev - 1)),
    [],
  );

  const isAnyModalOpen = modalCount > 0;

  const value = useMemo(
    () => ({
      registerModal,
      unregisterModal,
      isAnyModalOpen,
      scrollContainerRef,
    }),
    [isAnyModalOpen, registerModal, unregisterModal],
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}
