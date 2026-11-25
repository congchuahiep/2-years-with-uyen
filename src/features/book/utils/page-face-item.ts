import type { PageFaceItemPosition } from "../types/page-face-item";

/** Vị trí mặc định khi item được thả vào mặt trang (tâm mặt trang) */
export const DEFAULT_PAGE_FACE_ITEM_POSITION: PageFaceItemPosition = {
  x: 50,
  y: 50,
  rotation: 0,
  scale: 1,
  z: 1,
};

/**
 * Ghép position với default, dữ liệu thiếu trường vẫn render được.
 */
export function resolvePageFaceItemPosition(
  position?: Partial<PageFaceItemPosition> | null,
): PageFaceItemPosition {
  return { ...DEFAULT_PAGE_FACE_ITEM_POSITION, ...position };
}
