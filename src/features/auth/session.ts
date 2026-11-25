import "server-only";

import { cookies } from "next/headers";
import type { SessionPayload } from "./types/session-payload";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "./utils/session-cookie";
import { signSessionToken, verifySessionToken } from "./session-token";

/** Ký token từ payload và ghi vào cookie httpOnly. */
export async function createSession(payload: SessionPayload) {
  const token = await signSessionToken(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/** Đọc phiên hiện tại từ cookie, trả null nếu chưa đăng nhập hoặc token hỏng. */
export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

/** Xóa cookie phiên. */
export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}
