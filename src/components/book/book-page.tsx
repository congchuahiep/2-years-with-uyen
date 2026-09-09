"use client";

import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";
import { HeartIcon } from "@/components/icon/heart";
import { route } from "@/configs/route";
import type { BookPageItem } from "@/types/flipbook";
import { hashToIntRange } from "@/utils/hash";
import { Polaroid } from "../ui/polaroid";
import { RoughBox } from "../ui/rough-box";
import { BlankBookPage } from "./blank-book-page";
import { BookNumber } from "./static-element/book-number";

interface BookPageProps {
  /** Mặt của trang: trái hay phải (để vẽ bóng gáy + căn số trang) */
  side: "left" | "right";
  /** Các item thuộc đúng mặt này, mỗi item mang grid_index 0..3 */
  items: BookPageItem[];
  /** Số trang vật lý hiển thị nhỏ ở góc (bìa = 1, cặp đầu = 2,3, ...) */
  pageNumber: number;
}

/**
 * Một MẶT trang (FlipPage) của cuốn sổ — layout Grid 2x2.
 * Component này là 1 child của `HTMLFlipBook` nên phải forwardRef vào div.
 */
export const BookPage = forwardRef<HTMLDivElement, BookPageProps>(
  ({ side, items, pageNumber }, ref) => {
    const itemsByGrid = new Map(items.map((item) => [item.grid_index, item]));
    const slotIndexes = [0, 1, 2, 3];

    return (
      <BlankBookPage ref={ref} side={side}>
        <BookNumber pageNumber={pageNumber} side={side} />

        {/* Grid 2x2 chứa các item */}
        <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-6 p-8 place-items-center">
          {slotIndexes.map((gridIndex) => (
            <BookGridCell key={gridIndex} item={itemsByGrid.get(gridIndex)} />
          ))}
        </div>
      </BlankBookPage>
    );
  },
);

BookPage.displayName = "BookPage";

/** Một ô trong Grid 2x2 — có thể là moment, sticky note, hoặc ô trống */
function BookGridCell({ item }: { item: BookPageItem | undefined }) {
  // Ô trống
  if (!item) {
    return (
      <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-purple-300/70">
        <HeartIcon
          className="size-7 opacity-50"
          roughConfig={{ stroke: "var(--color-purple-400)" }}
        />
      </div>
    );
  }

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
    <Link
      key={moment.id}
      href={route.moments.detail(moment.id)}
      scroll={false}
    >
      <Polaroid
        text={moment.title}
        className="rotate-(--moment-rotate) hover:scale-102 duration-150"
        style={
          {
            "--moment-rotate": `${hashToIntRange(moment.title, -6, 6)}deg`,
          } as React.CSSProperties
        }
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
    </Link>
  );
}
