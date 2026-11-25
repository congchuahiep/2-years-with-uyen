"use client";

import useModal from "@/shared/hooks/useModal";
import { cn } from "@/shared/utils/cn";

/**
 * Bọc nội dung app, thu nhỏ và làm mờ khi có modal mở.
 * Đồng thời là phần tử cuộn gốc (`#root`) mà modal tham chiếu.
 */
export default function ModalContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAnyModalOpen, scrollContainerRef } = useModal();

  return (
    <div
      className={cn(
        "h-screen max-h-screen overflow-hidden origin-top",
        "shadow-[0_0_50px_0px_rgba(0,0,0,0.5) relative z-0",
        "transition-all duration-300 ease-out",
        isAnyModalOpen &&
          "scale-[0.9] translate-y-10 opacity-[0.6] rounded-3xl",
      )}
    >
      <div
        id="root"
        className="h-screen overflow-y-scroll overflow-x-hidden bg-bg"
        ref={scrollContainerRef}
      >
        {children}
      </div>
    </div>
  );
}
