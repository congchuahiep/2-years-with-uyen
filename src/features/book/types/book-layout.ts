/**
 * Kích thước tính được cho cuốn sổ.
 * `width`/`height` là kích thước của MỘT mặt trang sau khi đã co theo container.
 */
export interface BookLayout {
  portrait: boolean;
  width: number;
  height: number;
  /** Tỉ lệ thu/phóng nội dung so với thiết kế 520x650 */
  scale: number;
}
