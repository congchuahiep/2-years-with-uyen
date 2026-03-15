/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: Kệ */
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Color } from "@/types/color";
import { createClient } from "@/utils/supabase/server";

export type CreateMomentState = {
	error?: string;
	fields?: {
		title?: string;
		content?: string;
		letterColor?: Color;
	};
	success?: boolean;
} | null;

// Định nghĩa schema validation bằng Zod
const MomentSchema = z.object({
	title: z.string().min(1, "Thiếu tiêu đề kìa bạn ơi"),
	content: z.string().optional(),
});

export async function createMoment(
	_prevState: CreateMomentState,
	formData: FormData,
): Promise<CreateMomentState> {
	const supabase = await createClient();

	// 1. Lấy thông tin User hiện tại
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: "Bạn cần đăng nhập để thực hiện chức năng này" };
	}

	const rawData = {
		title: formData.get("title") as string,
		content: formData.get("content") as string,
		letterColor: formData.get("letterColor") as Color,
	};

	// Kiểm tra xem có phải lưu nháp không. Nếu là nháp, không cần validate.
	const isDraft = formData.get("status") === "draft";
	let validatedFields: any;
	if (!isDraft) {
		validatedFields = MomentSchema.safeParse(rawData);
		if (!validatedFields.success)
			return {
				fields: rawData,
				error: "Dữ liệu bạn nhập chưa hợp lệ, xem lại nhé.",
			};
	}

	try {
		const title = rawData.title;
		const content = rawData.content;
		const letterColor = rawData.letterColor;
		const status = formData.get("status") as string;
		const eventDate = formData.get("eventDate") as string;

		// Nhận Metadata đã được Client xử lý (đã có Public URL của Supabase)
		const metadataStr = formData.get("metadata");
		const metadata = metadataStr
			? JSON.parse(metadataStr as string)
			: ([] as any[]);

		const musicTrackStr = formData.get("music_track");
		const musicTrack = musicTrackStr
			? JSON.parse(musicTrackStr as string)
			: null;

		if (!isDraft && metadata.length === 0)
			return {
				fields: rawData,
				error: "Bạn chưa chọn ảnh nào cả.",
			};

		// 2. Lưu thông tin vào Database bảng 'moments'
		const { error: insertError } = await supabase.from("moments").insert({
			title,
			content,
			status: status,
			letter_color: letterColor as string,
			event_date: eventDate
				? new Date(eventDate).toISOString()
				: new Date().toISOString(),
			author_id: user.id,
			images: metadata,
			music_track: musicTrack,
		});

		if (insertError) {
			console.error("Lỗi tạo moment:", insertError);
			return {
				fields: rawData,
				error: "Có lỗi khi lưu khoảnh khắc, hãy thử lại nha",
			};
		}
	} catch (error) {
		console.error("Lỗi hệ thống khi tạo moment:", error);
		return {
			fields: rawData,
			error: "Hệ thống đang gặp sự cố nhỏ, phiền bạn thử lại sau",
		};
	}

	// 3. Revalidate và trả về thành công
	revalidatePath("/");
	return { success: true };
}
