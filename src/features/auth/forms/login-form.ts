import * as v from "valibot";

/**
 * Form đăng nhập. Một schema dùng cho cả hai phía:
 * - client: hiển thị lỗi từng field qua `useActionState`
 * - server (`actions.ts`): parse lại `FormData` trước khi xác thực
 */
export const LoginFormSchema = v.object({
  email: v.pipe(
    v.string("Nhập email đã"),
    v.trim(),
    v.toLowerCase(),
    v.nonEmpty("Nhập email đã"),
    v.email("Email không hợp lệ"),
  ),
  password: v.pipe(
    v.string("Nhập mật khẩu đã"),
    v.nonEmpty("Nhập mật khẩu đã"),
  ),
});

export type LoginForm = v.InferOutput<typeof LoginFormSchema>;
