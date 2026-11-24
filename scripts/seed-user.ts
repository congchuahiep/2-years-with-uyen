import { randomUUID } from "node:crypto";
import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { hashPassword } from "../src/features/auth/password";
import { users } from "../src/db/schema";

const email = process.env.SEED_EMAIL?.trim().toLowerCase();
const password = process.env.SEED_PASSWORD;
const displayName = process.env.SEED_NAME ?? "Người dùng";
const url = process.env.DATABASE_URL;

if (!email || !password || !url) {
	console.error(
		"Thiếu SEED_EMAIL, SEED_PASSWORD hoặc DATABASE_URL. Ví dụ:\n" +
			'  SEED_EMAIL=me@example.com SEED_PASSWORD="..." DATABASE_URL="file:./data/app.db" bun run db:seed',
	);
	process.exit(1);
}

const client = createClient({
	url,
	authToken: process.env.DATABASE_AUTH_TOKEN,
});
const db = drizzle(client, { schema: { users } });

const passwordHash = await hashPassword(password);
const [existing] = await db
	.select()
	.from(users)
	.where(eq(users.email, email))
	.limit(1);

if (existing) {
	await db
		.update(users)
		.set({ passwordHash, displayName })
		.where(eq(users.email, email));
	console.log(`Đã cập nhật mật khẩu cho ${email}`);
} else {
	await db.insert(users).values({
		id: randomUUID(),
		email,
		passwordHash,
		displayName,
		createdAt: new Date(),
	});
	console.log(`Đã tạo tài khoản ${email}`);
}

client.close();
