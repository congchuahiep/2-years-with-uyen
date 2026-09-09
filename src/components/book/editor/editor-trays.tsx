"use client";

import { motion, type PanInfo } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { useUnplacedMoments } from "@/hooks/use-flipbook";
import { useAddStickyNote, usePlacePageItem } from "@/hooks/use-flipbook-mutations";
import type { FlipSide, PageItemType } from "@/types/flipbook";
import { STICKER_CATALOG } from "./sticker-catalog";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Một mặt trang mà tray có thể thả item vào */
export interface EditorDropTarget {
  side: FlipSide;
  ref: React.RefObject<HTMLDivElement | null>;
}

interface EditorTraysProps {
  /** Cặp trang đang chỉnh sửa — mọi item mới đều được gắn vào cặp này */
  pairPageId: string;
  /** 2 mặt (trái/phải) của cặp trang — nơi kiểm tra vị trí thả */
  dropTargets: EditorDropTarget[];
}

/**
 * 2 TRAY của editor (quyết định Buổi B, mục 3):
 * 1) Sticker + sticky note (tạo mới)
 * 2) Moment chưa gắn vào trang nào — kéo thả vào canvas mặt trái/phải.
 */
export function EditorTrays({ pairPageId, dropTargets }: EditorTraysProps) {
  return (
    <div className="flex w-full flex-wrap items-stretch justify-center gap-4 rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
      {/* Tray 1a: sticker */}
      <TrayGroup title="Sticker">
        {STICKER_CATALOG.map((sticker) => (
          <TrayCard
            key={sticker.id}
            label={sticker.label}
            itemType="sticker"
            itemId={sticker.id}
            pairPageId={pairPageId}
            dropTargets={dropTargets}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white/80">
              {sticker.icon}
            </div>
          </TrayCard>
        ))}
      </TrayGroup>

      {/* Tray 1b: tạo sticky note */}
      <TrayGroup title="Ghi chú">
        <CreateNoteForm pairPageId={pairPageId} dropTargets={dropTargets} />
      </TrayGroup>

      {/* Tray 2: moment chưa gắn */}
      <TrayGroup title="Moment chưa gắn">
        <UnplacedMomentsTray pairPageId={pairPageId} dropTargets={dropTargets} />
      </TrayGroup>
    </div>
  );
}

function TrayGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-56 flex-1 flex-col gap-2">
      <p className="text-center text-xs font-bold tracking-wide text-purple-100 uppercase">
        {title}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">{children}</div>
    </div>
  );
}

/**
 * Thẻ kéo được trong tray: kéo ra khỏi tray, thả vào vùng 1 mặt trang →
 * `placePageItem` với toạ độ % chuyển từ vị trí chuột. Thả trượt → card
 * tự nhảy về chỗ cũ (dragSnapToOrigin).
 */
function TrayCard({
  children,
  label,
  itemType,
  itemId,
  pairPageId,
  dropTargets,
}: {
  children: React.ReactNode;
  label: string;
  itemType: PageItemType;
  itemId: string;
  pairPageId: string;
  dropTargets: EditorDropTarget[];
}) {
  const placePageItem = usePlacePageItem();

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const point = info.point;

    for (const target of dropTargets) {
      const rect = target.ref.current?.getBoundingClientRect();
      if (!rect) continue;
      if (
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom
      ) {
        const x = clamp(((point.x - rect.left) / rect.width) * 100, 4, 96);
        const y = clamp(((point.y - rect.top) / rect.height) * 100, 4, 96);
        placePageItem.mutate({
          pairPageId,
          side: target.side,
          itemType,
          itemId,
          position: { x, y, rotation: 0, scale: 1, z: 20 },
        });
        return;
      }
    }
  };

  return (
    <motion.div
      drag
      dragSnapToOrigin
      dragMomentum={false}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.1, zIndex: 30, cursor: "grabbing" }}
      whileHover={{ scale: 1.05 }}
      className="cursor-grab touch-none select-none"
    >
      <div className="pointer-events-none">{children}</div>
      <p className="mt-1 text-center text-[10px] font-bold text-purple-100">{label}</p>
    </motion.div>
  );
}

function UnplacedMomentsTray({
  pairPageId,
  dropTargets,
}: {
  pairPageId: string;
  dropTargets: EditorDropTarget[];
}) {
  const { data: moments = [] } = useUnplacedMoments();

  if (moments.length === 0) {
    return (
      <p className="w-48 text-center text-xs font-semibold text-purple-200/70">
        Không có moment nào đang “rảnh”. Hãy tạo một khoảnh khắc mới để đem lên trang nhé!
      </p>
    );
  }

  return (
    <>
      {moments.map((moment) => {
        const cover = moment.images?.find((image) => image.isMain) ?? moment.images?.[0];
        return (
          <TrayCard
            key={moment.id}
            label={moment.title}
            itemType="moment"
            itemId={moment.id}
            pairPageId={pairPageId}
            dropTargets={dropTargets}
          >
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-white/80 shadow-md">
              {cover ? (
                <Image
                  src={cover.url}
                  alt={moment.title}
                  width={80}
                  height={80}
                  className="size-20 object-cover"
                />
              ) : (
                <span className="text-3xl">💌</span>
              )}
            </div>
          </TrayCard>
        );
      })}
    </>
  );
}

/** Nút nhập nhanh một StickyNote rồi dán vào TRÁI của cặp trang đang sửa */
function CreateNoteForm({
  pairPageId,
  dropTargets,
}: {
  pairPageId: string;
  dropTargets: EditorDropTarget[];
}) {
  const addStickyNote = useAddStickyNote();
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#fef3c7");

  const handleAdd = () => {
    const text = content.trim();
    if (!text) return;

    const target = dropTargets[0];
    const rect = target.ref.current?.getBoundingClientRect();
    const x = rect ? 50 : 50;
    const y = rect ? 40 : 40;

    addStickyNote.mutate({
      content: text,
      color,
      pairPageId,
      side: target.side,
      position: { x, y, rotation: -3, scale: 1, z: 20 },
    });
    setContent("");
  };

  const NOTE_COLORS = ["#fef3c7", "#fbcfe8", "#bae6fd", "#bbf7d0", "#fecaca"];

  return (
    <div className="flex w-52 flex-col items-stretch gap-1.5">
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Viết gì đó nhắn vào trang…"
        rows={2}
        className="resize-none rounded-md border border-purple-300/40 bg-white/85 px-2 py-1 text-xs font-semibold text-amber-950 placeholder:text-purple-400 outline-none"
      />
      <div className="flex items-center justify-between gap-1">
        <div className="flex gap-1">
          {NOTE_COLORS.map((noteColor) => (
            <button
              key={noteColor}
              type="button"
              onClick={() => setColor(noteColor)}
              className={`size-5 rounded-full border ${color === noteColor ? "border-purple-600 ring-2 ring-purple-300" : "border-black/10"}`}
              style={{ backgroundColor: noteColor }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!content.trim()}
          className="rounded-md bg-yellow-200 px-2 py-1 text-[11px] font-bold text-amber-900 shadow-sm disabled:opacity-40"
        >
          Dán 📝
        </button>
      </div>
    </div>
  );
}