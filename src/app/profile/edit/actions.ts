"use server";

import { revalidatePath } from "next/cache";
import type { UserProfile } from "@/types/user-profile";
import { createClient } from "@/utils/supabase/server";

export type UpdateProfilePayload = {
	first_name: string;
	last_name: string;
	avatar_url: string;
};

export async function updateUserProfile(
	payload: UpdateProfilePayload,
): Promise<UserProfile> {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) throw new Error("Bạn cần đăng nhập để thực hiện hành động này.");

	const { data: updatedProfile, error: updateError } = await supabase
		.from("profiles")
		.update({
			first_name: payload.first_name,
			last_name: payload.last_name,
			avatar_url: payload.avatar_url,
		})
		.eq("id", user.id)
		.select()
		.single();

	if (updateError) {
		console.error("Lỗi cập nhật profile:", updateError);
		throw new Error("Không thể cập nhật thông tin. Vui lòng thử lại.");
	}

	revalidatePath("/profile/edit");
	revalidatePath(`/${user.id}`);

	if (!updatedProfile)
		throw new Error("Không tìm thấy profile sau khi cập nhật.");

	return updatedProfile;
}
