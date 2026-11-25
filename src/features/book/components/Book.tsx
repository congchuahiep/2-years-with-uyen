"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { cn } from "@/shared/utils/cn";
import type { BookLayout } from "../types/book-layout";
import type { PageFace } from "../types/page-face";
import { buildBookPages } from "../utils/build-book-pages";
import { buildStaticBookPages } from "../utils/build-static-book-pages";
import { INITIAL_LAYOUT } from "../utils/book-layout";
import useBookLayout from "../hooks/useBookLayout";
import Button from "@/shared/components/Button";
import ArrowIcon from "@/shared/icons/ArrowIcon";
import { playSound } from "@/shared/utils/audio";
import BookCover from "./BookCover";

type FlipBookControl = {
  flipNext: (corner?: "top" | "bottom") => void;
  flipPrev: (corner?: "top" | "bottom") => void;
  turnToPage: (page: number) => void;
  getPageCount: () => number;
  /** Settings object của page-flip (thư viện core không ship type nên khai báo tối thiểu tại đây) */
  getSettings: () => { disableFlipByClick: boolean };
};

interface BookProps {
  /** Chuỗi mặt trang phẳng theo thứ tự lật, không phải cặp mặt trang. */
  faces: PageFace[];
}

export default function Book({ faces }: BookProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const flipBookRef = useRef<{ pageFlip: () => FlipBookControl | undefined }>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(0);
  const currentPageRef = useRef(0);
  const previousPortrait = useRef(INITIAL_LAYOUT.portrait);

  const [showFrontGhostCover, setShowFrontGhostCover] = useState(false);
  const [showBackGhostCover, setShowBackGhostCover] = useState(true);

  const layout = useBookLayout(containerRef);

  // Ở 2 chế độ, StPageFlip đánh số trang khác nhau → khi chuyển chế độ 2 trang
  // thì quay về trang bìa cho chắc chắn (chạy trước paint, trước khi
  // HTMLFlipBook được remount với `startPage` mới).
  useLayoutEffect(() => {
    if (previousPortrait.current !== layout.portrait) {
      previousPortrait.current = layout.portrait;
      setCurrentPage(0);
    }
  }, [layout.portrait]);

  const pageChildren = useMemo(
    () =>
      faces.length > 0
        ? buildBookPages(faces, layout)
        : buildStaticBookPages(layout),
    [faces, layout],
  );

  /**
   * Workaround bug page-flip 2.0.x: khi bật `disableFlipByClick`, thư viện chặn mọi cú lật
   * có điểm kích hoạt không nằm trong vùng 4 góc của "khung sổ ảo" (rộng gấp đôi 1 trang).
   * - `flipNext()` neo điểm theo `rect.left + 2*pageWidth` → luôn trúng góc phải → hoạt động.
   * - `flipPrev()` lại cố định điểm tại `x = 10` (cách mép trái container 10px). Ở chế độ
   *   portrait trang được căn giữa nên `rect.left < 0`, điểm này rơi vào giữa trang →
   *   thư viện nuốt im lặng, nút ◀ không lật.
   *
   * Cách xử lý: tạm gỡ guard đúng trong lúc gọi API rồi khôi phục ngay. Guard chỉ được
   * đọc một lần, đồng bộ ngay khi lệnh lật bắt đầu, nên thao tác click/kéo tay trên trang
   * vẫn bị chặn như cũ.
   */
  const flipByButton = (direction: "prev" | "next") => {
    const flip = flipBookRef.current?.pageFlip();
    if (!flip) return;

    const settings = flip.getSettings();
    const previous = settings.disableFlipByClick;
    settings.disableFlipByClick = false;
    try {
      if (direction === "prev") flip.flipPrev("top");
      else flip.flipNext("bottom");
    } finally {
      settings.disableFlipByClick = previous;
    }
  };

  const handleNext = () => {
    if (currentPage === pageChildren.length - 3) setShowBackGhostCover(false);
    flipByButton("next");
  };

  const handlePrev = () => {
    if (currentPage === 1) setShowFrontGhostCover(false);
    flipByButton("prev");
  };

  const handleBookState = ({
    data: event,
  }: {
    data: "user_fold" | "fold_corner" | "flipping" | "read";
  }) => {
    console.log(event);

    switch (event) {
      case "flipping":
        playSound("flip");
        return;
      case "fold_corner": {
        document.body.style.cursor = "grab";
        const releaseMouse = () => {
          document.body.style.cursor = "grab";
          window.removeEventListener("mouseup", releaseMouse);
        };
        const grabMouse = () => {
          document.body.style.cursor = "grabbing";
          window.removeEventListener("mousedown", grabMouse);
          window.addEventListener("mouseup", releaseMouse);
        };
        window.addEventListener("mousedown", grabMouse);
        return;
      }
      case "user_fold": {
        playSound("flip");
        document.body.style.cursor = "grabbing";
        const releaseMouse = () => {
          playSound("flip");
          document.body.style.cursor = "initial";
          window.removeEventListener("mouseup", releaseMouse);
        };
        window.addEventListener("mouseup", releaseMouse);
        return;
      }
      case "read":
        document.body.style.cursor = "initial";
        // Bìa đã mở xong: bật ghost. Lúc này tờ bìa lót đã phủ lên nó nên
        // không nhìn thấy; ghost chỉ lộ ra khi bìa lót bị lật tiếp.
        setShowFrontGhostCover(currentPageRef.current >= 1);
        setShowBackGhostCover(
          currentPageRef.current <= pageChildren.length - 2,
        );
        return;
    }
  };

  return (
    <div ref={containerRef} className="flex w-full flex-col items-center gap-6">
      <div
        className="w-full drop-shadow-2xl z-50 relative"
        style={{ width: layout.portrait ? layout.width : layout.width * 2 }}
        onPointerDownCapture={(event) => {
          // Tắt/bật ghost ngay từ cú chạm, trước khi page-flip kịp chạy
          // animation — onFlip chỉ bắn sau khi lật xong nên chậm một nhịp.
          if (layout.portrait) return;
          const rect = event.currentTarget.getBoundingClientRect();
          const leftHalf = event.clientX < rect.left + rect.width / 2;

          // Ở spread đầu: chạm nửa trái = bắt đầu đóng bìa trước.
          if (currentPage === 1 && leftHalf) {
            setShowFrontGhostCover(false);
            return;
          }

          // Ở spread cuối: chạm nửa phải = bắt đầu mở bìa sau.
          if (currentPage === pageChildren.length - 3 && !leftHalf) {
            setShowBackGhostCover(false);
          }
        }}
      >
        <HTMLFlipBook
          key={`${layout.portrait ? "portrait" : "landscape"}-${Math.round(layout.width)}-${Math.round(layout.height)}`}
          ref={flipBookRef}
          width={layout.width}
          height={layout.height}
          size="fixed"
          minWidth={layout.width}
          maxWidth={layout.width}
          minHeight={layout.height}
          maxHeight={layout.height}
          startPage={currentPage}
          usePortrait={layout.portrait}
          autoSize
          drawShadow
          flippingTime={500}
          startZIndex={50}
          maxShadowOpacity={0.35}
          showCover={true}
          mobileScrollSupport
          clickEventForward
          useMouseEvents
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick
          className="mx-auto"
          style={{ transition: "all 0s ease" }}
          onFlip={(event) => {
            const page = event.data as number;
            currentPageRef.current = page;
            setCurrentPage(page);
            // onFlip bắn ở ĐẦU cú lật nên có thể phản ứng ngay:
            // - bắt đầu đóng bìa (0) → tắt ghost trước khi bìa kịp mở ra
            // - bắt đầu che bìa lót (>= 3) → bật ghost trước khi nó biến mất
            if (page === 0) setShowFrontGhostCover(false);
            if (page >= 3) setShowFrontGhostCover(true);
          }}
          onChangeState={handleBookState}
        >
          {pageChildren}
        </HTMLFlipBook>

        <GhostBookDepth
          layout={layout}
          currentPage={currentPage}
          frontVisible={showFrontGhostCover}
          backVisible={showBackGhostCover}
        />
      </div>

      {/* Bộ điều khiển */}
      <div className="flex items-center gap-4 z-10">
        <Button
          perspective="right"
          buttonSize="small"
          fill="var(--color-yellow-300)"
          onClick={handlePrev}
          disabled={currentPage <= 0}
        >
          <ArrowIcon variant="thick" className="rotate-180 scale-150" />
        </Button>
        <span className="min-w-28 text-center text-sm font-bold text-purple-100">
          Trang {currentPage + 1}/{pageChildren.length}
        </span>
        <Button
          perspective="left"
          buttonSize="small"
          fill="var(--color-yellow-300)"
          onClick={handleNext}
        >
          <ArrowIcon variant="thick" className="scale-150" />
        </Button>
      </div>

      <p className="text-xs font-semibold text-purple-200/70 select-none">
        💡 Kéo ở mép / góc trang để lật theo tay — hoặc dùng nút ◀ ▶
      </p>
    </div>
  );
}

function GhostBookDepth({
  layout,
  currentPage,
  frontVisible,
  backVisible,
}: {
  layout: BookLayout;
  currentPage: number;
  frontVisible: boolean;
  backVisible: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 size-full grid -z-50",
        !layout.portrait && "grid-cols-2",
      )}
    >
      {!layout.portrait ? (
        <>
          <BookCover
            key="ghost-cover-front"
            side="left"
            className={cn(frontVisible ? "opacity-100" : "opacity-0")}
          />
          <BookCover
            key="ghost-cover-back"
            side="right"
            className={cn(backVisible ? "opacity-100" : "opacity-0")}
          />
        </>
      ) : (
        <BookCover
          key="ghost-cover"
          className={cn(currentPage >= 1 ? "opacity-100" : "opacity-0")}
        />
      )}
    </div>
  );
}
