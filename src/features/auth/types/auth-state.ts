/**
 * Kết quả Server Action trả cho `useActionState`.
 *
 * - `error`: lỗi chung của form (sai tài khoản, mất kết nối, ...)
 * - `fieldErrors`: lỗi từng field, lấy từ `v.flatten(issues)`
 */
export interface AuthState {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}
