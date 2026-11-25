import { SignJWT, jwtVerify } from "jose";
import type { SessionPayload } from "./types/session-payload";
import { SESSION_MAX_AGE_SECONDS } from "./utils/session-cookie";

function getSecret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("SESSION_SECRET phải có ít nhất 32 ký tự");
  }
  return new TextEncoder().encode(value);
}

/** Ký JWT cho phiên đăng nhập, hạn dùng bằng max-age của cookie. */
export async function signSessionToken(
  payload: SessionPayload,
): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecret());
}

/** Dùng được ở cả proxy lẫn server component; trả null thay vì ném lỗi. */
export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || typeof payload.email !== "string") return null;
    return { id: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}
