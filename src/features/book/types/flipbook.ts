import type { RichMoment } from "@/types/moment";

/**
 * Mặt của trang giấy trong một cặp trang (PairFlipPage).
 * Trong DB chỉ lưu PairFlipPage — flip page trái/phải chỉ là khái niệm hiển thị.
 */
export type FlipSide = "left" | "right";

/** Loại item được phép gắn lên một mặt trang (mở rộng được về sau) */
export type PageItemType = "moment" | "sticky_note" | "sticker";

/**
 * Vị trí TỰ DO của một item trên mặt trang (freeform — thay cho grid 2x2).
 * Tọa độ x, y lưu theo PHẦN TRĂM (0-100) của kích thước mặt trang để cuốn sổ
 * co giãn responsive mà item không bị lệch vị trí (quyết định F5).
 */
export interface PageItemPosition {
	/** Vị trí X theo % chiều rộng mặt trang (0-100), mặc định 50 = giữa */
	x: number;
	/** Vị trí Y theo % chiều cao mặt trang (0-100), mặc định 50 = giữa */
	y: number;
	/** Góc xoay (độ) — không có giá trị thì 0 */
	rotation: number;
	/** Tỷ lệ phóng thu (1 = gốc) — scale cả khung bằng CSS transform (quyết định F3) */
	scale: number;
	/** Thứ tự lớp chồng lên nhau (cao = nằm trên) */
	z: number;
}

/** Vị trí mặc định khi item được thả vào trang (tâm mặt trang) */
export const DEFAULT_PAGE_ITEM_POSITION: PageItemPosition = {
	x: 50,
	y: 50,
	rotation: 0,
	scale: 1,
	z: 1,
};

/**
 * Ghép position với default — dữ liệu cũ/thiếu trường vẫn render được.
 */
export function resolvePageItemPosition(position?: Partial<PageItemPosition> | null): PageItemPosition {
	return { ...DEFAULT_PAGE_ITEM_POSITION, ...position };
}

/** Cặp trang — đơn vị lưu trữ chính của sổ (bảng `pair_flip_pages`) */
export interface PairFlipPage {
	id: string;
	/** Thứ tự của cặp trang trong sổ (bắt đầu từ 1, duy nhất) */
	page_order: number;
	created_at: string | null;
	updated_at: string | null;
}

/** Nhãn mục lục thò ra mép sách (bảng `flip_tabs`) */
export interface FlipTab {
	id: string;
	pair_page_id: string;
	label: string;
	color: string | null;
	/** Vị trí tab: mép trái hoặc mép phải của sổ */
	position: "left" | "right";
	created_at: string | null;
}

/** Nội dung ghi chú dán (bảng `sticky_notes`) */
export interface StickyNote {
	id: string;
	content: string;
	color: string;
	created_at: string | null;
	updated_at: string | null;
}

/**
 * Một item trên một mặt trang (bảng `page_items`) — freeform.
 * `item_id` đa hình: moments / sticky_notes / sticker-catalog tùy item_type.
 * Ràng buộc UNIQUE(item_type, item_id) — mỗi item chỉ gắn đúng 1 nơi (quyết định F4).
 */
export interface PageItem {
	id: string;
	pair_page_id: string;
	side: FlipSide;
	position: PageItemPosition;
	item_type: PageItemType;
	/** Trỏ tới `moments.id` / `sticky_notes.id` / sticker id tùy item_type */
	item_id: string;
	created_at: string | null;
	updated_at: string | null;
}

/**
 * PageItem đã resolve dữ liệu thật (được API service ghép nối).
 * - moment/stickyNote: có giá trị theo item_type tương ứng.
 * - sticker: chưa có bảng dữ liệu (chỉ là catalog client) → cả 2 đều null.
 */
export type BookPageItem = PageItem & {
	moment: RichMoment | null;
	stickyNote: StickyNote | null;
};

/** Cặp trang kèm các item đã resolve — dữ liệu sẵn sàng cho UI cuốn sổ */
export type BookPairFlipPage = PairFlipPage & {
	items: BookPageItem[];
};

/** Dữ liệu toàn cuốn sổ (cho route `/book` và chế độ sửa) */
export type BookData = {
	pages: BookPairFlipPage[];
	tabs: FlipTab[];
};

/** Tham số đặt/di chuyển item lên trang (dùng qua API service) */
export type PlaceItemInput = {
	pairPageId: string;
	side: FlipSide;
	itemType: PageItemType;
	itemId: string;
	position?: Partial<PageItemPosition>;
};