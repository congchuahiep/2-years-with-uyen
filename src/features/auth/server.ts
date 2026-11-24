import "server-only";

import { eq } from "drizzle-orm";
import { getDb } from "@/shared/db/client";
import { users } from "@/shared/db/schema";
import { verifyPassword } from "./password";

/** Trả về user nếu email + mật khẩu khớp, ngược lại null. */
export async function verifyCredentials(email: string, password: string) {
	const db = getDb();
	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.email, email.toLowerCase()))
		.limit(1);

	if (!user) return null;

	const valid = await verifyPassword(password, user.passwordHash);
	return valid ? { id: user.id, email: user.email } : null;
}
