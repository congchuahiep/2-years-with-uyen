"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export type CreateMomentState = {
	error?: string;
	success?: boolean;
} | null;

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

	try {
		// 2. Lấy dữ liệu từ Form
		const title = formData.get("title") as string;
		const content = formData.get("content") as string;
		const status = formData.get("status") as string;
		const eventDate = formData.get("eventDate") as string;

		// Lấy tất cả file ảnh
		const rawImages = formData.getAll("images") as File[];
		const validImages = rawImages.filter(
			(file) => file.size > 0 && file.name !== "undefined",
		);

		if (!title) {
			return { error: "Thiếu tiêu đề kìa bạn ơi" };
		}

		if (validImages.length === 0) {
			return { error: "Phải có ít nhất 1 bức ảnh chứ nhỉ" };
		}

		if (validImages.length > 5) {
			return { error: "Chỉ được tải lên tối đa 5 bức ảnh thôi nha" };
		}

		// 3. Upload ảnh lên Storage bucket 'moment_images' và map vào metadata JSON
		const metadataStr = formData.get("metadata") as string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const metadata = metadataStr ? JSON.parse(metadataStr) : ([] as any[]);

		for (const imageFile of validImages) {
			const fileExt = imageFile.name.split(".").pop();
			const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

			const { error: uploadError, data: uploadData } = await supabase.storage
				.from("moment_images")
				.upload(fileName, imageFile, {
					cacheControl: "3600",
					upsert: false,
				});

			if (uploadError) {
				console.error("Lỗi upload ảnh:", uploadError);
				return { error: "Không tải ảnh lên được, thử lại xem sao" };
			}

			const {
				data: { publicUrl },
			} = supabase.storage.from("moment_images").getPublicUrl(uploadData.path);

			// Gán publicUrl vào element đầu tiên chưa có url
			const targetMeta = metadata.find((m: any) => m.url.startsWith("blob:"));
			if (targetMeta) {
				targetMeta.url = publicUrl;
			}
		}

		// 4. Lưu thông tin vào Database bảng 'moments'
		const { error: insertError } = await supabase.from("moments").insert({
			title,
			content,
			status: status || "draft",
			event_date: eventDate
				? new Date(eventDate).toISOString()
				: new Date().toISOString(),
			author_id: user.id,
			images: metadata,
		});

		if (insertError) {
			console.error("Lỗi tạo moment:", insertError);
			return { error: "Có lỗi khi lưu khoảnh khắc, hãy thử lại nha" };
		}
	} catch (error) {
		console.error("Lỗi hệ thống khi tạo moment:", error);
		return { error: "Hệ thống đang gặp sự cố nhỏ, phiền bạn thử lại sau" };
	}

	// 5. Revalidate list moments page
	revalidatePath("/");
	// 6. Redirect to home or moment detail (currently returning success state to handle redirect in client)
	return { success: true };
}
