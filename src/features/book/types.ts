/**
 * Khái niệm nền của cuốn sổ, mô phỏng đúng thực thể một cuốn sách thật.
 * Chi tiết đầy đủ nằm ở docs/features/book.md, đọc trước khi sửa.
 *
 * Tóm tắt:
 * - **Mặt trang (PageFace)** là đơn vị hiển thị nhỏ nhất, gồm 2 loại:
 *   mặt trang bìa (4 mặt của 2 trang bìa) và mặt trang giấy (intro,
 *   outro, nội dung người dùng).
 * - **Cặp mặt trang (PageSpread)**: 2 mặt trang hiện cùng lúc ở landscape.
 *   Portrait chỉ hiện 1 mặt, nhưng chỉ số spread vẫn giữ nguyên để hai
 *   chế độ có chung một hệ toạ độ.
 * - **Trang (page)**: khái niệm vật lý (2 mặt), không dùng làm đơn vị hiển thị.
 *
 * `HTMLFlipBook` với `showCover = true` tự xử lý mặt dummy của spread 0:
 * mặt trang đầu tiên truyền vào là mặt ngoài bìa trước (nằm bên phải),
 * nửa trái để trống sẵn. Vì vậy dữ liệu chỉ cần chuỗi mặt trang phẳng,
 * không cần mô hình hoá dummy.
 */

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
 * Một MẶT TRANG — đơn vị hiển thị nhỏ nhất của cuốn sổ.
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
	/** Góc xoay (độ) — không có giá trị thì 0 */
	rotation: number;
	/** Tỷ lệ phóng thu (1 = gốc) — scale cả khung bằng CSS transform */
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

/**
 * Dữ liệu sẵn sàng cho UI: chuỗi mặt trang phẳng theo đúng thứ tự lật.
 * Đơn vị nhận vào của `Book` là faces, không phải spread, để phục vụ cả
 * hai chế độ landscape lẫn portrait.
 */
export type BookData = {
	/** Danh sách mặt trang, xếp theo thứ tự lật (face index tăng dần). */
	faces: PageFace[];
};
