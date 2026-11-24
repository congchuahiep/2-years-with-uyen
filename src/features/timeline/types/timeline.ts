/** Toạ độ theo phần trăm (0-100) trong khung timeline. */
export interface TimelinePoint {
	x: number;
	y: number;
}

/**
 * Một mục dữ liệu muốn đặt lên timeline.
 * `date` được dùng để tự chèn mốc năm, `data` là thứ nơi dùng tự render.
 */
export interface TimelineEntry<T> {
	id: string;
	date: string;
	data: T;
}

/** Node sau khi đã chèn mốc năm xen giữa các entry. */
export type TimelineNode<T> =
	| { type: "item"; id: string; data: T }
	| { type: "year"; year: number };
