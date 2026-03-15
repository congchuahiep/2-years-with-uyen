import type { Color } from "./color";
import type { DeezerTrack } from "./dezzer";
import type { PolaroidImage } from "./polaroid";

/**
 * Đại diện cho một bản ghi đơn lẻ từ bảng `moments` trong cơ sở dữ liệu.
 * Đây là kiểu dữ liệu thô lấy trực tiếp từ schema của cơ sở dữ liệu.
 */
export type Moment = {
	id: string;
	title: string;
	content: string | null;
	status: "draft" | "private" | "public";
	author_id: string;
	event_date: string;
	created_at: string | null;
	updated_at: string | null;
	letter_color: Color;
	images: PolaroidImage[];
	music_track: DeezerTrack | null;
};

/**
 * Đại diện cho dữ liệu hồ sơ công khai của một người dùng.
 * Tương ứng với bảng `profiles`.
 */
export type Profile = {
	id: string;
	first_name: string | null;
	last_name: string | null;
	avatar_url: string | null;
};

/**
 * Đại diện cho một đối tượng "moment" dạng đầy đủ, trong đó `author_id`
 * được thay thế bằng một đối tượng `Profile` đầy đủ.
 * Đây là kiểu dữ liệu mà bạn thường sử dụng trong giao diện ứng dụng.
 */
export type RichMoment = Omit<Moment, "author_id"> & {
	author: Profile;
};
