import "server-only";

import { cookies } from "next/headers";
import {
	SESSION_COOKIE,
	SESSION_MAX_AGE_SECONDS,
	type SessionPayload,
	signSessionToken,
	verifySessionToken,
} from "./session-token";

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

export async function getSession(): Promise<SessionPayload | null> {
	const token = (await cookies()).get(SESSION_COOKIE)?.value;
	return token ? verifySessionToken(token) : null;
}

export async function destroySession() {
	(await cookies()).delete(SESSION_COOKIE);
}
