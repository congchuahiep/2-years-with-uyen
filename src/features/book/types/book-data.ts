import type { PageFace } from "./page-face";

/**
 * Dữ liệu sẵn sàng cho UI: chuỗi mặt trang phẳng theo đúng thứ tự lật.
 * Đơn vị nhận vào của `Book` là faces, không phải spread, để phục vụ cả
 * hai chế độ landscape lẫn portrait.
 */
export type BookData = {
  /** Danh sách mặt trang, xếp theo thứ tự lật (face index tăng dần). */
  faces: PageFace[];
};
