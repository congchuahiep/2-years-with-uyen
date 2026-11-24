"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  useCreatePairFlipPage,
  useDeletePairFlipPage,
} from "@/features/book/hooks/use-flipbook-mutations";
import type { BookPairFlipPage, FlipSide } from "@/features/book/types";
import { EDITOR_FACE_HEIGHT, EDITOR_FACE_WIDTH, EditorFace } from "./editor-face";
import { type EditorDropTarget, EditorTrays } from "./editor-trays";

interface BookEditorProps {
  /** Toàn bộ cặp trang của sổ — người dùng chọn 1 cặp để sửa */
  pages: BookPairFlipPage[];
  onClose: () => void;
}

/**
 * Editor FREEFORM (Buổi B): overlay toàn màn hình trên `/book`.
 * - Khoá việc lật sách: overlay phủ kín + `pointer-events` chặn sự kiện xuống HTMLFlipBook.
 * - Canvas = CẢ 2 MẶT của cặp trang đang chọn (F1), dàn theo kích thước thiết kế
 *   520×650 rồi `scale()` cho vừa màn hình — toạ độ % không phụ thuộc màn hình.
 * - 2 TRAY: sticker + ghi chú | moments chưa gắn (kéo thả lên canvas).
 */
export function BookEditor({ pages, onClose }: BookEditorProps) {
  const [selectedPairId, setSelectedPairId] = useState(pages[0]?.id ?? "");
  const selected = pages.find((pair) => pair.id === selectedPairId) ?? pages[0];

  const leftFaceRef = useRef<HTMLDivElement>(null);
  const rightFaceRef = useRef<HTMLDivElement>(null);

  const createPage = useCreatePairFlipPage();
  const deletePage = useDeletePairFlipPage();

  // Co 2 mặt trang theo cửa sổ để luôn vừa màn hình
  const [scale, setScale] = useState(0.8);
  useLayoutEffect(() => {
    const measure = () => {
      const next = Math.min(
        (window.innerWidth - 2 * 40) / (EDITOR_FACE_WIDTH * 2 + 28),
        (window.innerHeight - 280) / EDITOR_FACE_HEIGHT,
        1,
      );
      setScale(Math.max(0.3, next));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  if (!selected) return null;

  const leftItems = selected.items.filter((item) => item.side === "left");
  const rightItems = selected.items.filter((item) => item.side === "right");
  const isPairEmpty = leftItems.length === 0 && rightItems.length === 0;

  const dropTargets: EditorDropTarget[] = [
    { side: "left", ref: leftFaceRef },
    { side: "right", ref: rightFaceRef },
  ];

  const faces: { side: FlipSide; ref: React.RefObject<HTMLDivElement | null>; items: typeof leftItems }[] = [
    { side: "left", ref: leftFaceRef, items: leftItems },
    { side: "right", ref: rightFaceRef, items: rightItems },
  ];

  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center gap-3 overflow-auto bg-purple-950/85 p-5 backdrop-blur-sm">
      {/* Thanh công cụ: chọn cặp trang + thêm/xoá trang */}
      <div className="flex w-full max-w-4xl flex-wrap items-center justify-center gap-2">
        {pages.map((pair) => {
          const count = pair.items.length;
          const isActive = pair.id === selected.id;
          return (
            <button
              key={pair.id}
              type="button"
              onClick={() => setSelectedPairId(pair.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold shadow-md transition-transform hover:scale-105 ${isActive ? "bg-yellow-300 text-amber-950" : "bg-white/15 text-purple-100"}`}
            >
              Cặp {pair.page_order}
              <span className={`ml-1.5 rounded-full px-1.5 text-[10px] ${isActive ? "bg-amber-100" : "bg-white/20"}`}>
                {count}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => createPage.mutate({ afterPageId: selected.id })}
          className="rounded-lg bg-green-300 px-3 py-1.5 text-xs font-bold text-green-950 shadow-md hover:scale-105"
        >
          ＋ Trang trống
        </button>
        <button
          type="button"
          onClick={() => deletePage.mutate(selected.id)}
          disabled={!isPairEmpty}
          title={isPairEmpty ? "Xoá cặp trang trống này" : "Chỉ xoá được trang trống"}
          className="rounded-lg bg-red-300 px-3 py-1.5 text-xs font-bold text-red-950 shadow-md hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          🗑 Xoá trang
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-purple-900 shadow-md hover:scale-105"
        >
          ✕ Hoàn tất
        </button>
      </div>

      {/* Canvas: 2 mặt của cặp trang đang chọn */}
      <div className="flex items-start justify-center gap-3.5">
        {faces.map((face) => (
          <div
            key={face.side}
            className="relative shrink-0 overflow-hidden rounded-md shadow-2xl"
            style={{ width: EDITOR_FACE_WIDTH * scale, height: EDITOR_FACE_HEIGHT * scale }}
          >
            <div
              className="absolute inset-0"
              style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
            >
              <EditorFace
                pairPageId={selected.id}
                side={face.side}
                items={face.items}
                faceRef={face.ref}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-[11px] font-semibold text-purple-200/70 select-none">
        💡 Kéo sticker / moment ở dưới bỏ vào 2 mặt trang; kéo item trên trang để dời; hover item để phóng thu / xoay / gỡ.
      </p>

      {/* 2 TRAY */}
      <EditorTrays pairPageId={selected.id} dropTargets={dropTargets} />
    </div>
  );
}