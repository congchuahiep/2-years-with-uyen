import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/proxy";

export async function proxy(request: NextRequest) {
	// Kiểm tra nếu biến môi trường MAINTENANCE_MODE được bật
	if (process.env.MAINTENANCE_MODE === "true") {
		// Tránh lỗi loop chuyển hướng vô hạn khi user đã ở trang /maintenance
		if (!request.nextUrl.pathname.startsWith("/maintenance")) {
			const maintenanceUrl = new URL("/maintenance", request.url);
			return NextResponse.redirect(maintenanceUrl);
		}
	}

	// Nếu đang không bảo trì, tiếp tục kiểm tra Auth Session của Supabase
	return await updateSession(request);
}

// Cấu hình matcher để chỉ chạy trên các route nhất định
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
