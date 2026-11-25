import * as v from "valibot";

/**
 * Người dùng mà tầng app được thấy.
 *
 * Không chứa `passwordHash`: hash chỉ đọc trong `server.ts` và không bao giờ
 * đi ra khỏi tầng server.
 */
export const UserSchema = v.object({
  id: v.string(),
  email: v.pipe(v.string(), v.email()),
  displayName: v.string(),
  createdAt: v.date(),
});

export type User = v.InferOutput<typeof UserSchema>;
