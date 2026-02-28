import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/proxy";

export async function proxy(request: NextRequest) {
	return await updateSession(request);
}

// Cấu hình matcher để chỉ chạy trên các route nhất định (tuỳ thuộc vào specs của Next 16)
export const config = {
	matcher: [
		/*
		 * Bỏ qua paths bắt đầu với:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - images, svgs...
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
