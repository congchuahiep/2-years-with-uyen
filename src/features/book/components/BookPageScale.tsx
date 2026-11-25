"use client";

import { forwardRef, type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/shared/utils/cn";
import {
  BOOK_PAGE_DESIGN_HEIGHT,
  BOOK_PAGE_DESIGN_WIDTH,
} from "../utils/book-page-scale";

interface BookPageScaleProps {
  children: ReactNode;
  className?: string;
}

/**
 * Bọc một mặt trang của flip book.
 *
 * StPageFlip gán kích thước thực tế (px) cho phần tử trang theo kích thước của
 * cuốn sổ, nên khi sổ bị co nhỏ (màn hình hẹp / container hẹp) mà nội dung vẫn
 dàn theo 520x650 sẽ bị tràn, vỡ layout. Component này luôn dàn nội dung ở
 * đúng kích thước thiết kế rồi dùng `transform: scale()` để thu/phóng theo kích
 * thước thực tế mà ResizeObserver đo được, nhờ vậy nội dung co theo tỉ lệ và
 * không bị vỡ.
 */
const BookPageScale = forwardRef<HTMLDivElement, BookPageScaleProps>(
  ({ children, className }, ref) => {
    const outerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
      const element = outerRef.current;
      if (!element) return;

      const updateScale = () => {
        // Trang ẩn (StPageFlip set display:none) có kích thước 0 — bỏ qua, giữ nguyên scale cũ
        if (!element.clientWidth || !element.clientHeight) return;

        const nextScale = Math.min(
          element.clientWidth / BOOK_PAGE_DESIGN_WIDTH,
          element.clientHeight / BOOK_PAGE_DESIGN_HEIGHT,
        );

        setScale((previous) =>
          Math.abs(previous - nextScale) < 0.001 ? previous : nextScale,
        );
      };

      updateScale();

      const observer = new ResizeObserver(updateScale);
      observer.observe(element);

      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={(node) => {
          outerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn("relative size-full", className)}
      >
        <div
          className="relative"
          style={{
            width: BOOK_PAGE_DESIGN_WIDTH,
            height: BOOK_PAGE_DESIGN_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transformStyle: "flat",
            WebkitTransformStyle: "flat",
          }}
        >
          {children}
        </div>
      </div>
    );
  },
);

BookPageScale.displayName = "BookPageScale";

export default BookPageScale;
