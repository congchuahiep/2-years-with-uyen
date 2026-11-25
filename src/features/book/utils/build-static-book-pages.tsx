import type { ReactNode } from "react";
import type { BookLayout } from "../types/book-layout";
import BookCover from "../components/BookCover";
import BookPageScale from "../components/BookPageScale";
import EndBookPage from "../components/static-element/EndBookPage";
import FrontBookCover from "../components/static-element/FrontBookCover";
import IntroBookPages from "../components/static-element/IntroBookPages";

/**
 * Dựng chuỗi trang tĩnh của cuốn sổ khi chưa có dữ liệu người dùng.
 *
 * Thứ tự giữ đúng mô hình sách thật: bìa trước, tờ lót (chỉ landscape),
 * 5 trang intro, trang kết, tờ lót sau (chỉ landscape), bìa sau. Portrait
 * vẽ mọi mặt như trang phải, giống `buildBookPages`.
 */
export function buildStaticBookPages(layout: BookLayout): ReactNode[] {
  const showCoverBacks = !layout.portrait;

  return [
    <BookPageScale key="front-cover">
      <FrontBookCover />
    </BookPageScale>,
    ...(showCoverBacks
      ? [
          <BookPageScale key="flyleaf">
            <BookCover side="left" />
          </BookPageScale>,
        ]
      : []),
    ...IntroBookPages(layout.portrait ? "right" : undefined),
    <BookPageScale key="end-message">
      <EndBookPage side={layout.portrait ? "right" : undefined} />
    </BookPageScale>,
    ...(showCoverBacks
      ? [
          <BookPageScale key="end-blank">
            <BookCover side="right" />
          </BookPageScale>,
        ]
      : []),
    <BookPageScale key="back-cover">
      <BookCover />
    </BookPageScale>,
  ];
}
