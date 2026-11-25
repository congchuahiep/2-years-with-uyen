"use client";

import { forwardRef } from "react";
import type { PageFaceItem } from "../types/page-face-item";
import { resolvePageFaceItemPosition } from "../utils/page-face-item";
import BlankBookPage from "./BlankBookPage";
import BookNumber from "./static-element/BookNumber";

interface BookPageProps {
  /** Mặt của trang: trái hay phải (để vẽ bóng gáy + căn số trang) */
  side: "left" | "right";
  /** Các item thuộc đúng mặt này, mỗi item mang vị trí tự do (position, %) */
  items: PageFaceItem[];
  /** Số trang vật lý hiển thị nhỏ ở góc (intro 1..5, cặp moment đầu = 6,7, ...) */
  pageNumber: number;
}

/**
 * Một MẶT trang (FlipPage) của cuốn sổ — layout FREEFORM:
 * mỗi item nằm ở vị trí % riêng (x, y, rotation, scale, z) như vẽ trên giấy.
 * Component này là 1 child của `HTMLFlipBook` nên phải forwardRef vào div.
 */
const BookPage = forwardRef<HTMLDivElement, BookPageProps>(
  ({ side, items, pageNumber }, ref) => {
    return (
      <BlankBookPage ref={ref} side={side}>
        <BookNumber pageNumber={pageNumber} side={side} />

        {items.map((item) => (
          <FreeformItem key={item.id} item={item} />
        ))}
      </BlankBookPage>
    );
  },
);

BookPage.displayName = "BookPage";

/**
 * Bọc item theo vị trí/rotation/scale/z từ position (freeform).
 *
 * Phần nội dung của item chưa có: renderer cho photo, sticky note và sticker
 * sẽ được thêm cùng editor mới, nên hiện chỉ giữ khung định vị.
 */
function FreeformItem({ item }: { item: PageFaceItem }) {
  const position = resolvePageFaceItemPosition(item.position);

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        zIndex: position.z,
        transform: `translate(-50%, -50%) rotate(${position.rotation}deg) scale(${position.scale})`,
      }}
    />
  );
}
export default BookPage;
