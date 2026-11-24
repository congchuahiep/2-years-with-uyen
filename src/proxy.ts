import { type NextRequest, NextResponse } from "next/server";
import {
	SESSION_COOKIE,
	verifySessionToken,
} from "@/features/auth/session-token";

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Bảo trì: chặn mọi route trừ chính trang bảo trì.
	if (
		process.env.MAINTENANCE_MODE === "true" &&
		!pathname.startsWith("/maintenance")
	) {
		return NextResponse.redirect(new URL("/maintenance", request.url));
	}

	const token = request.cookies.get(SESSION_COOKIE)?.value;
	const session = token ? await verifySessionToken(token) : null;

	if (pathname.startsWith("/login")) {
		return session
			? NextResponse.redirect(new URL("/", request.url))
			: NextResponse.next();
	}

	if (!session && !pathname.startsWith("/maintenance")) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
