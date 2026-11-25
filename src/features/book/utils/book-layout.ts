import type { BookLayout } from "../types/book-layout";
import {
  BOOK_PAGE_DESIGN_HEIGHT,
  BOOK_PAGE_DESIGN_WIDTH,
} from "./book-page-scale";

/**
 * Ngưỡng chuyển chế độ hiển thị:
 * - Chiều rộng trình duyệt > 1024px (xấp xỉ giới hạn `max-w-5xl` của layout) -> mở 2 trang
 * - Chiều rộng trình duyệt <= 1024px -> hiển thị 1 trang (portrait)
 */
export const PORTRAIT_BREAKPOINT = 1024;

/** Trì hoãn đo lại kích thước khi đang kéo resize, tránh việc remount cuốn sổ liên tục */
export const LAYOUT_DEBOUNCE_MS = 150;

/** Kích thước mặc định trước lần đo đầu tiên (1 trang, đúng tỉ lệ thiết kế). */
export const INITIAL_LAYOUT: BookLayout = {
  portrait: false,
  width: BOOK_PAGE_DESIGN_WIDTH,
  height: BOOK_PAGE_DESIGN_HEIGHT,
  scale: 1,
};
