"use server";

import { redirect } from "next/navigation";
import * as v from "valibot";
import { route } from "@/configs/route";
import { LoginFormSchema } from "./forms/login-form";
import { verifyCredentials } from "./server";
import { createSession, destroySession } from "./session";
import type { AuthState } from "./types/auth-state";

/**
 * Đăng nhập bằng `FormData` của form login.
 *
 * Tự parse input bằng valibot, xác thực qua `server.ts`, tạo phiên rồi
 * chuyển trang. Trả `AuthState` cho `useActionState` khi thất bại.
 */
export async function login(
  _prevState: AuthState | null,
  formData: FormData,
): Promise<AuthState> {
  const result = v.safeParse(LoginFormSchema, Object.fromEntries(formData));

  if (!result.success) {
    return {
      fieldErrors: v.flatten(result.issues).nested ?? {},
      error: "Thông tin đăng nhập chưa hợp lệ.",
    };
  }

  const user = await verifyCredentials(
    result.output.email,
    result.output.password,
  );
  if (!user) {
    return { error: "Sai email hoặc mật khẩu." };
  }

  await createSession({ id: user.id, email: user.email });
  redirect(route.home);
}

/** Hủy phiên đăng nhập rồi về trang login. */
export async function logout() {
  await destroySession();
  redirect(route.login);
}
