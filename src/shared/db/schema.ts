import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/** Tài khoản đăng nhập — chỉ hai người dùng nên giữ bảng tối giản. */
export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	email: text("email").notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	displayName: text("display_name").notNull(),
	createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});
