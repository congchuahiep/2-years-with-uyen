"use client";

import { type RefObject, useLayoutEffect, useState } from "react";
import type { BookLayout } from "../types/book-layout";
import {
  INITIAL_LAYOUT,
  LAYOUT_DEBOUNCE_MS,
  PORTRAIT_BREAKPOINT,
} from "../utils/book-layout";
import {
  BOOK_PAGE_DESIGN_HEIGHT,
  BOOK_PAGE_DESIGN_WIDTH,
} from "../utils/book-page-scale";

/**
 * Đo chiều rộng container + viewport để tính kích thước và chế độ hiển thị của sổ.
 *
 * Kích thước luôn được tính sao cho cuốn sổ vừa khít container:
 * - chế độ 2 trang: mỗi trang = min(520, container / 2)
 * - chế độ 1 trang: mỗi trang = min(520, container)
 * và chiều cao giữ nguyên tỉ lệ 520:650 (nội dung bên trong tự scale theo,
 * xem `BookPageScale`). Như vậy sổ không bao giờ tràn container.
 */
export default function useBookLayout(
  containerRef: RefObject<HTMLDivElement | null>,
): BookLayout {
  const [layout, setLayout] = useState<BookLayout>(INITIAL_LAYOUT);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timer: number | undefined;

    const measure = () => {
      const viewportWidth = window.innerWidth;
      const containerWidth = container.clientWidth;

      const portrait = viewportWidth <= PORTRAIT_BREAKPOINT;
      const width = Math.min(
        BOOK_PAGE_DESIGN_WIDTH,
        Math.max(portrait ? containerWidth : containerWidth / 2, 0),
      );
      const scale = width / BOOK_PAGE_DESIGN_WIDTH;
      const height = BOOK_PAGE_DESIGN_HEIGHT * scale;

      setLayout((previous) =>
        previous.portrait === portrait &&
        Math.abs(previous.width - width) < 0.5 &&
        Math.abs(previous.height - height) < 0.5
          ? previous
          : { portrait, width, height, scale },
      );
    };

    const scheduleMeasure = () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(measure, LAYOUT_DEBOUNCE_MS);
    };

    measure();

    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(container);

    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [containerRef]);

  return layout;
}
