import type { PageFaceItem } from "./page-face-item";

/** Loại mặt trang: bìa hay giấy */
export type PageFaceKind = "cover" | "paper";

/**
 * Phân biệt mặt ngoài/mặt trong của trang bìa.
 * `outer-front` = mặt ngoài bìa trước, `outer-back` = mặt ngoài bìa sau,
 * `inner` = mặt trong (bìa trước lẫn bìa sau).
 */
export type PageCoverVariant = "outer-front" | "inner" | "outer-back";

/** Mặt trang nằm ở nửa trái hay nửa phải của spread (landscape) */
export type PageFaceSide = "left" | "right";

/**
 * Một MẶT TRANG, đơn vị hiển thị nhỏ nhất của cuốn sổ.
 * Face là khái niệm render, không có id ở DB.
 */
export interface PageFace {
  kind: PageFaceKind;
  side: PageFaceSide;
  /** Chỉ bắt buộc khi kind = "cover"; paper không cần. */
  coverVariant?: PageCoverVariant;
  /** Nội dung của mặt trang giấy; cover luôn để rỗng. */
  items: PageFaceItem[];
}
