import type { RichMoment } from "./moment";

/**
 * Mặt của trang giấy trong một cặp trang (PairFlipPage).
 * Trong DB chỉ lưu PairFlipPage — flip page trái/phải chỉ là khái niệm hiển thị.
 */
export type FlipSide = "left" | "right";

/** Loại item được phép gắn vào một ô của grid 2x2 (mở rộng được về sau) */
export type PageItemType = "moment" | "sticky_note";

/**
 * Sticker nổi tự do trên một mặt trang.
 * Tọa độ x, y lưu theo PHẦN TRĂM (0-100) của kích thước mặt trang để
 * cuốn sổ co giãn responsive mà sticker không bị lệch vị trí.
 */
export interface Sticker {
	id: string;
	/** Loại sticker (id sprite/đường dẫn hình ảnh) */
	type: string;
	/** Sticker thuộc mặt nào — gắn theo mặt giấy khi lật (quyết định C1) */
	side: FlipSide;
	/** Vị trí X theo % chiều rộng mặt trang (0-100) */
	x: number;
	/** Vị trí Y theo % chiều cao mặt trang (0-100) */
	y: number;
	/** Góc xoay (độ) */
	rotation: number;
	/** Tỷ lệ phóng thu (1 = gốc) */
	scale: number;
	/** Màu sắc của sticker */
	color: string;
}

/** Cặp trang — đơn vị lưu trữ chính của sổ (bảng `pair_flip_pages`) */
export interface PairFlipPage {
	id: string;
	/** Thứ tự của cặp trang trong sổ (bắt đầu từ 1, duy nhất) */
	page_order: number;
	/** Danh sách sticker nổi tự do trên cặp trang này */
	stickers: Sticker[];
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

/** Vị trí một item trên mặt trang (bảng `page_items`) */
export interface PageItem {
	id: string;
	pair_page_id: string;
	side: FlipSide;
	/** Chỉ số ô trong grid 2x2: 0-3 */
	grid_index: number;
	item_type: PageItemType;
	/** Trỏ tới `moments.id` hoặc `sticky_notes.id` tùy item_type (đa hình) */
	item_id: string;
	created_at: string | null;
	updated_at: string | null;
}

/**
 * PageItem đã resolve dữ liệu thật (được API service ghép nối).
 * Đúng một trong hai trường moment/stickyNote có giá trị theo item_type.
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

// ----------------------------------------------------------------------------
// Mô hình hiển thị — tách khỏi DB để FlipBook dùng được khi chưa có dữ liệu
// (Buổi 2 dùng dữ liệu demo, sau này map từ BookPageItem ra cùng cấu trúc)
// ----------------------------------------------------------------------------

/** Một ô grid 2x2 đã sẵn sàng render trên trang nội dung */
export type BookContentItem =
	| {
			kind: "moment";
			id: string;
			title: string;
			imageUrl: string | null;
			createdAt: string;
	  }
	| {
			kind: "sticky_note";
			id: string;
			content: string;
			color: string;
	  };

/** Cặp trang (spread) nội dung — index 0..3 tương ứng 4 ô của từng mặt */
export type BookContentPage = {
	id: string;
	items: {
		left: (BookContentItem | null)[];
		right: (BookContentItem | null)[];
	};
};
