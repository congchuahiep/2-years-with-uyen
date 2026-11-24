import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "uyen_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type SessionPayload = {
	id: string;
	email: string;
};

function getSecret() {
	const value = process.env.SESSION_SECRET;
	if (!value || value.length < 32) {
		throw new Error("SESSION_SECRET phải có ít nhất 32 ký tự");
	}
	return new TextEncoder().encode(value);
}

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
