"use client";

import { motion, type PanInfo } from "motion/react";
import Image from "next/image";
import { useMovePageItem, useRemovePageItem } from "@/features/book/hooks/use-flipbook-mutations";
import { resolvePageItemPosition } from "@/features/book/types";
import type { BookPageItem, FlipSide, PageItemPosition } from "@/features/book/types";
import { Polaroid } from "@/shared/components/polaroid";
import { RoughBox } from "@/shared/components/rough-box";
import { BlankBookPage } from "../blank-book-page";
import { getStickerIcon } from "./sticker-catalog";

/** Kích thước THIẾT KẾ của một mặt trang — mọi phép tính toạ độ dùng hằng số này (xem BookPageScale) */
export const EDITOR_FACE_WIDTH = 520;
export const EDITOR_FACE_HEIGHT = 650;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

interface EditorFaceProps {
  pairPageId: string;
  side: FlipSide;
  items: BookPageItem[];
  /** Ref để tray kéo kiểm tra "thả vào mặt nào" (getBoundingClientRect đã tính transform scale) */
  faceRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Canvas 1 mặt trang trong editor: nền giấy + các item FREEFORM
 * (kéo xung quanh bằng motion.drag — pattern PolaroidBoard, F3/F6).
 * Vị trí item lưu % (F5), quy đổi px ↔ % theo kích thước thiết kế.
 */
export function EditorFace({ pairPageId, side, items, faceRef }: EditorFaceProps) {
  const maxZ = items.reduce((max, item) => Math.max(max, resolvePageItemPosition(item.position).z), 1);

  return (
    <BlankBookPage ref={faceRef} side={side}>
      {items.map((item) => (
        <FaceItem
          key={item.id}
          pairPageId={pairPageId}
          side={side}
          item={item}
          maxZ={maxZ}
        />
      ))}
    </BlankBookPage>
  );
}

function FaceItem({
  pairPageId,
  side,
  item,
  maxZ,
}: {
  pairPageId: string;
  side: FlipSide;
  item: BookPageItem;
  maxZ: number;
}) {
  const movePageItem = useMovePageItem();
  const removePageItem = useRemovePageItem();
  const position = resolvePageItemPosition(item.position);

  // Độ lệch tâm theo px (mặt lúc nào cũng = 520×650 trong không gian thiết kế)
  const centerX = ((position.x - 50) / 100) * EDITOR_FACE_WIDTH;
  const centerY = ((position.y - 50) / 100) * EDITOR_FACE_HEIGHT;

  const updatePosition = (next: Partial<PageItemPosition>) => {
    const merged: PageItemPosition = { ...position, ...next };
    movePageItem.mutate({
      itemId: item.id,
      pairPageId,
      side,
      position: {
        ...merged,
        x: Math.round(merged.x * 10) / 10,
        y: Math.round(merged.y * 10) / 10,
      },
    });
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const nextX =
      ((centerX + info.offset.x + EDITOR_FACE_WIDTH / 2) / EDITOR_FACE_WIDTH) * 100;
    const nextY =
      ((centerY + info.offset.y + EDITOR_FACE_HEIGHT / 2) / EDITOR_FACE_HEIGHT) * 100;
    updatePosition({
      x: clamp(nextX, 0, 100),
      y: clamp(nextY, 0, 100),
    });
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.2}
      animate={{ x: centerX, y: centerY }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: position.scale * 1.05, cursor: "grabbing" }}
      style={{ left: "50%", top: "50%", zIndex: position.z }}
      className="absolute cursor-grab touch-none group/item"
    >
      <div
        className="relative"
        style={{
          transform: `rotate(${position.rotation}deg) scale(${position.scale})`,
        }}
      >
        <ItemVisual item={item} />

        {/* Toolbar khi hover (pattern PolaroidBoard) */}
        <div className="absolute -top-4 -left-4 z-20 flex flex-col items-center gap-1 opacity-0 transition-opacity group-hover/item:opacity-100 pointer-events-none">
          <ToolButton title="Lên lớp trên" onClick={() => updatePosition({ z: maxZ + 1 })}>
            ▲
          </ToolButton>
          <ToolButton title="Phóng to" onClick={() => updatePosition({ scale: clamp(position.scale + 0.1, 0.4, 1.8) })}>
            +
          </ToolButton>
          <ToolButton title="Thu nhỏ" onClick={() => updatePosition({ scale: clamp(position.scale - 0.1, 0.4, 1.8) })}>
            −
          </ToolButton>
          <ToolButton title="Xoay trái" onClick={() => updatePosition({ rotation: position.rotation - 7.5 })}>
            ⟲
          </ToolButton>
          <ToolButton title="Xoay phải" onClick={() => updatePosition({ rotation: position.rotation + 7.5 })}>
            ⟳
          </ToolButton>
          <ToolButton title="Gỡ khỏi trang" danger onClick={() => removePageItem.mutate(item.id)}>
            ×
          </ToolButton>
        </div>
      </div>
    </motion.div>
  );
}

function ToolButton({
  children,
  title,
  danger,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`pointer-events-auto flex size-7 cursor-pointer items-center justify-center rounded-md text-sm font-bold shadow-md ${danger ? "bg-red-200 text-red-700" : "bg-white/90 text-purple-800"}`}
    >
      {children}
    </button>
  );
}

/** Hiển thị nội dung item trong editor (moment = Polaroid, note, sticker) */
function ItemVisual({ item }: { item: BookPageItem }) {
  // Sticker — render theo catalog (item_id = sticker id)
  if (item.item_type === "sticker") {
    return getStickerIcon(item.item_id);
  }

  // Sticky note
  if (item.item_type === "sticky_note" && item.stickyNote) {
    return (
      <div
        className="flex items-center justify-center overflow-hidden rounded-sm p-3 shadow-md select-none"
        style={{ backgroundColor: item.stickyNote.color, width: 150, minHeight: 100 }}
      >
        <p className="line-clamp-5 text-center text-xs leading-tight font-bold text-amber-950">
          {item.stickyNote.content}
        </p>
      </div>
    );
  }

  // Moment — Polaroid như view mode
  const moment = item.moment;
  if (!moment) return null;

  const coverImage = moment.images?.find((image) => image.isMain) ?? moment.images?.[0];

  return (
    <Polaroid text={moment.title} size="sm">
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