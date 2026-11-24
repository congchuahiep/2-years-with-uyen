"use client";

import Image from "next/image";
import { forwardRef } from "react";
import type { BookPageItem } from "@/features/book/types";
import { resolvePageItemPosition } from "@/features/book/types";
import { Polaroid } from "@/shared/components/polaroid";
import { RoughBox } from "@/shared/components/rough-box";
import { BlankBookPage } from "./blank-book-page";
import { BookNumber } from "./static-element/book-number";

interface BookPageProps {
  /** Mặt của trang: trái hay phải (để vẽ bóng gáy + căn số trang) */
  side: "left" | "right";
  /** Các item thuộc đúng mặt này, mỗi item mang vị trí tự do (position, %) */
  items: BookPageItem[];
  /** Số trang vật lý hiển thị nhỏ ở góc (intro 1..5, cặp moment đầu = 6,7, ...) */
  pageNumber: number;
}

/**
 * Một MẶT trang (FlipPage) của cuốn sổ — layout FREEFORM:
 * mỗi item nằm ở vị trí % riêng (x, y, rotation, scale, z) như vẽ trên giấy.
 * Component này là 1 child của `HTMLFlipBook` nên phải forwardRef vào div.
 */
export const BookPage = forwardRef<HTMLDivElement, BookPageProps>(
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

/** Bọc item theo vị trí/rotation/scale/z từ position (freeform) */
function FreeformItem({ item }: { item: BookPageItem }) {
  const position = resolvePageItemPosition(item.position);

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        zIndex: position.z,
        transform: `translate(-50%, -50%) rotate(${position.rotation}deg) scale(${position.scale})`,
      }}
    >
      <ItemContent item={item} />
    </div>
  );
}

/**
 * Nội dung thật của item.
 * - moment: Polaroid (size sm) + tiêu đề, xoay nhẹ theo hash, bọc Link → detail.
 * - sticky_note: giấy note màu theo `color`.
 * - sticker: chưa có catalog renderer — tạm ẩn (sẽ làm ở Buổi B cùng editor).
 */
function ItemContent({ item }: { item: BookPageItem }) {
  if (item.item_type === "sticker") return null;

  // Sticky note
  if (item.item_type === "sticky_note" && item.stickyNote) {
    return (
      <div
        className="-rotate-1 flex items-center justify-center overflow-hidden rounded-sm p-2 shadow-md select-none"
        style={{ backgroundColor: item.stickyNote.color }}
      >
        <p className="line-clamp-4 text-center text-xs leading-tight font-bold text-amber-950">
          {item.stickyNote.content}
        </p>
      </div>
    );
  }

  // Moment
  const moment = item.moment;
  if (!moment) return null;

  const coverImage =
    moment.images?.find((image) => image.isMain) ?? moment.images?.[0];

  return (
    <Polaroid
      text={moment.title}
      className="rotate-(--moment-rotate) duration-150"
      size="sm"
    >
      {coverImage && (
        <RoughBox className="size-full">
          <Image
            src={coverImage.url}
            alt={moment.title}
            className="object-cover -z-50 pointer-events-none"
            fill
          />
        </RoughBox>
      )}
    </Polaroid>
  );
}
