import "server-only";

import { eq } from "drizzle-orm";
import * as v from "valibot";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { verifyPassword } from "./password";
import { type User, UserSchema } from "./resources/user";

/**
 * Trả về user nếu email + mật khẩu khớp, ngược lại null.
 *
 * Row đọc từ DB được validate bằng `UserSchema` sau khi đã bỏ `passwordHash`,
 * nhờ vậy hình dạng dữ liệu luôn khớp resource dù schema DB đổi.
 */
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<User | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (!row) return null;

  const valid = await verifyPassword(password, row.passwordHash);
  if (!valid) return null;

  return v.parse(UserSchema, {
    id: row.id,
    email: row.email,
    displayName: row.displayName,
    createdAt: row.createdAt,
  });
}
