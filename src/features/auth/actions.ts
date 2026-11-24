"use server";

import { redirect } from "next/navigation";
import { route } from "@/configs/route";
import { verifyCredentials } from "./server";
import { createSession, destroySession } from "./session";

export type AuthState = { error?: string } | null;

export async function login(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Nhập email và mật khẩu đã." };
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    return { error: "Sai email hoặc mật khẩu." };
  }

  await createSession(user);
  redirect(route.home);
}

export async function logout() {
  await destroySession();
  redirect(route.login);
}
