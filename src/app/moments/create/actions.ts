"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Color } from "@/types/color";
import type { DeezerTrack } from "@/types/dezzer";
import type { PolaroidImage } from "@/types/polaroid";
import { createClient } from "@/utils/supabase/server";

export type CreateMomentPayload = {
	title: string;
	content?: string;
	letterColor: Color;
	status: "draft" | "public" | "private";
	eventDate: string;
	metadata: PolaroidImage[];
	music_track: DeezerTrack | null;
};

const MomentSchema = z.object({
	title: z.string().min(1, "Thiếu tiêu đề kìa bạn ơi"),
	metadata: z.array(z.any()).min(1, "Bạn chưa chọn ảnh nào cả."),
});

export async function createMoment(payload: CreateMomentPayload) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("Bạn cần đăng nhập để thực hiện chức năng này");
	}

	// Chỉ validate dữ liệu khi không phải là lưu nháp
	if (payload.status !== "draft") {
		const validatedFields = MomentSchema.safeParse({
			title: payload.title,
			metadata: payload.metadata,
		});

		if (!validatedFields.success) {
			const errorMessage = validatedFields.error.message;
			throw new Error(errorMessage || "Dữ liệu bạn nhập chưa hợp lệ.");
		}
	}

	try {
		const { data, error: insertError } = await supabase
			.from("moments")
			.insert({
				title: payload.title,
				content: payload.content,
				status: payload.status,
				letter_color: payload.letterColor,
				event_date: new Date(payload.eventDate).toISOString(),
				author_id: user.id,
				images: payload.metadata,
				music_track: payload.music_track,
			})
			.select()
			.single();

		if (insertError) {
			console.error("Lỗi tạo moment:", insertError);
			throw new Error("Có lỗi khi lưu khoảnh khắc, hãy thử lại nha.");
		}

		// Revalidate cache cho trang chủ và trang chi tiết (nếu có)
		revalidatePath("/");
		if (data?.id) {
			revalidatePath(`/moments/${data.id}`);
		}

		// Trả về dữ liệu vừa được tạo
		return data;
	} catch (error) {
		console.error("Lỗi hệ thống khi tạo moment:", error);
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Hệ thống đang gặp sự cố nhỏ, phiền bạn thử lại sau.");
	}
}
