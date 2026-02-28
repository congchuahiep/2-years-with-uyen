"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type ActionState = {
	error?: string;
} | null;

const sillyMessages = [
	"Hình như ai đó đang gõ nhầm mật khẩu rồi",
	"Sai mật mã rồi nha, thử nhớ lại xem nào",
	"Mật khẩu này chắc của người yêu cũ rồi",
	"Gõ chậm thôi kẻo lại nhầm tiếp bây giờ",
	"Sai rồi, hay là để người yêu gõ hộ cho",
	"Tên đăng nhập hoặc mật khẩu đang trốn ở đâu đó rồi",
	"Tào lao quá",
];

export async function login(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	const supabase = await createClient();

	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		let errorMessage = error.message;

		if (errorMessage.includes("Invalid login credentials")) {
			errorMessage =
				sillyMessages[Math.floor(Math.random() * sillyMessages.length)];
		} else if (errorMessage.includes("Email not confirmed")) {
			errorMessage = "Chưa xác minh email nè, kiểm tra hòm thư đi bạn ơi";
		} else if (
			errorMessage.includes("Too many requests") ||
			errorMessage.includes("rate_limit")
		) {
			errorMessage =
				"Thử nhiều quá hệ thống mệt rồi, nghỉ một xíu lát thử lại sau nha";
		} else if (errorMessage.includes("User not found")) {
			errorMessage = "Ủa, tụi mình làm gì có email này đâu ta";
		} else {
			errorMessage = `Lỗi hệ thống một xíu, thử lại xem sao nha (${errorMessage})`;
		}

		return { error: errorMessage };
	}

	revalidatePath("/", "layout");
	redirect("/");
}
