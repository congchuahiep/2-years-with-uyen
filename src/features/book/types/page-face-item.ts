/**
 * Loại item được phép đặt lên mặt trang giấy.
 * Mới chỉ để hệ thống sẵn sàng, chưa có dữ liệu lưu ở DB.
 */
export type PageFaceItemType = "photo" | "sticky_note" | "sticker";

/**
 * Vị trí của item trên mặt trang, lưu theo PHẦN TRĂM (0-100) để sổ
 * co giãn responsive mà item không bị lệch vị trí.
 */
export interface PageFaceItemPosition {
  /** Vị trí X theo % chiều rộng mặt trang (0-100), mặc định 50 = giữa */
  x: number;
  /** Vị trí Y theo % chiều cao mặt trang (0-100), mặc định 50 = giữa */
  y: number;
  /** Góc xoay (độ), không có giá trị thì 0 */
  rotation: number;
  /** Tỷ lệ phóng thu (1 = gốc), scale cả khung bằng CSS transform */
  scale: number;
  /** Thứ tự lớp chồng lên nhau (cao = nằm trên) */
  z: number;
}

/**
 * Một item nằm trên mặt trang giấy. `item_id` đa hình theo `item_type`;
 * nội dung thật của item sẽ được resolve ở tầng dữ liệu khi có DB.
 */
export interface PageFaceItem {
  id: string;
  item_type: PageFaceItemType;
  item_id: string;
  position: PageFaceItemPosition;
}
