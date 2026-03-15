"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export type FormState = {
	error?: string;
	success?: boolean;
};

export async function updateUserProfile(
	_prevState: FormState,
	formData: FormData,
): Promise<FormState> {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: "Bạn cần đăng nhập để thực hiện hành động này." };
	}

	const firstName = formData.get("first_name") as string;
	const lastName = formData.get("last_name") as string;
	const avatarFile = formData.get("avatar") as File;

	let avatar_url = formData.get("current_avatar_url") as string;

	// Handle avatar upload
	if (avatarFile && avatarFile.size > 0) {
		const filePath = `${user.id}/${Date.now()}_${avatarFile.name}`;
		const { data: uploadData, error: uploadError } = await supabase.storage
			.from("profile_avatars")
			.upload(filePath, avatarFile, {
				upsert: true,
			});

		if (uploadError) {
			console.error("Lỗi tải lên avatar:", uploadError);
			return { error: "Không thể tải lên avatar. Vui lòng thử lại." };
		}

		const { data: publicUrlData } = supabase.storage
			.from("profile_avatars")
			.getPublicUrl(uploadData.path);

		avatar_url = publicUrlData.publicUrl;
	}

	// Update profile
	const { error: updateError } = await supabase
		.from("profiles")
		.update({
			first_name: firstName,
			last_name: lastName,
			avatar_url: avatar_url,
		})
		.eq("id", user.id);

	if (updateError) {
		console.error("Lỗi cập nhật profile:", updateError);
		return { error: "Không thể cập nhật thông tin. Vui lòng thử lại." };
	}

	revalidatePath("/profile/edit");

	return { success: true };
}
