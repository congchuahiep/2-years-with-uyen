import * as v from "valibot";

/**
 * Các biến môi trường app cần. Chỉ khai báo thứ thật sự dùng, để lỗi thiếu
 * env hiện ra ngay ở chỗ đọc chứ không âm thầm thành `undefined`.
 */
const EnvSchema = v.object({
  DATABASE_URL: v.pipe(v.string(), v.nonEmpty("Thiếu DATABASE_URL")),
  DATABASE_AUTH_TOKEN: v.optional(v.string()),
  SESSION_SECRET: v.pipe(
    v.string(),
    v.minLength(32, "SESSION_SECRET phải có ít nhất 32 ký tự"),
  ),
});

export type Env = v.InferOutput<typeof EnvSchema>;

/**
 * Đọc và validate toàn bộ env.
 *
 * Gọi lazy ở chỗ cần (vd `getDb`) thay vì lúc import, để `next build` không
 * đòi env của môi trường chạy.
 */
export function getEnv(): Env {
  return v.parse(EnvSchema, process.env);
}
