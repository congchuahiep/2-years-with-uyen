import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/configs/env";
import { route } from "@/configs/route";

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value }) => {
					request.cookies.set(name, value);
				});
				supabaseResponse = NextResponse.next({
					request,
				});
				cookiesToSet.forEach(({ name, value, options }) => {
					supabaseResponse.cookies.set(name, value, options);
				});
			},
		},
	});

	// Tự động làm mới session
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Bảo vệ route: Nếu chưa đăng nhập và không nằm ở các trang public (login/auth)
	if (
		!user &&
		!request.nextUrl.pathname.startsWith("/login") &&
		!request.nextUrl.pathname.startsWith("/auth") &&
		// Bỏ qua các đường dẫn tĩnh, assets tự động
		!request.nextUrl.pathname.startsWith("/_next") &&
		!/\.(.*)$/.test(request.nextUrl.pathname)
	) {
		const url = request.nextUrl.clone();
		url.pathname = route.login;
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}
