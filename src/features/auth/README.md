# Feature auth

Đăng nhập bằng email/mật khẩu, giữ phiên bằng cookie JWT, chặn route qua `src/proxy.ts`.

## Khái niệm

- **User**: người dùng mà tầng app được thấy. Resource không chứa `passwordHash`.
- **Session**: JWT HS256 ký bằng `SESSION_SECRET`, chứa `id` và `email`, sống 30 ngày trong cookie `httpOnly`.
- **Session token**: phần ký/verify thuần, dùng được ở cả proxy lẫn server component.
- **Password**: hash scrypt, chỉ dùng trong `server.ts` và script seed.

## Luồng đăng nhập

```text
app/login/page.tsx
  -> useActionState(login)
  -> actions.ts: Object.fromEntries(FormData) -> LoginFormSchema
  -> server.ts: verifyCredentials
  -> session.ts: createSession
  -> redirect("/")
```

Thất bại thì action trả `AuthState` có `error` và `fieldErrors`; thành công thì `redirect` ném điều khiển, không trả state.

## File và API

| File | Export | Client import |
|---|---|---|
| `actions.ts` | `login`, `logout` | có, qua `@/features/auth` |
| `resources/user.ts` | `UserSchema`, `type User` | có |
| `forms/login-form.ts` | `LoginFormSchema`, `type LoginForm` | có |
| `types/auth-state.ts` | `AuthState` | có |
| `types/session-payload.ts` | `SessionPayload` | có (type) |
| `server.ts` | `verifyCredentials` | không, `server-only` |
| `session.ts` | `createSession`, `getSession`, `destroySession` | không, `server-only` |
| `session-token.ts` | `signSessionToken`, `verifySessionToken` | chỉ `proxy.ts` |
| `password.ts` | `hashPassword`, `verifyPassword` | chỉ script seed |
| `utils/session-cookie.ts` | `SESSION_COOKIE`, `SESSION_MAX_AGE_SECONDS` | có |

`index.ts` chỉ re-export `actions`, `forms`, `resources`, `types`. `server.ts` và `session.ts` không bao giờ được re-export từ barrel.

## Đọc phiên ở server

Page hoặc layout cần biết ai đang đăng nhập thì import thẳng file cụ thể:

```ts
import { getSession } from "@/features/auth/session";

const session = await getSession();
if (!session) redirect("/login");
```

`proxy.ts` chỉ verify chữ ký, không truy vấn DB, nên mỗi request không tốn round-trip tới Turso.

## Tạo tài khoản

Không hard-code mật khẩu. Dùng script seed:

```bash
SEED_EMAIL=me@example.com SEED_PASSWORD="..." bun run db:seed
```

## Lưu ý

- `SESSION_SECRET` phải dài ít nhất 32 ký tự; `configs/env.ts` và `session-token.ts` đều kiểm.
- `password.ts` không có `import "server-only"` để script seed import được. Nó là crypto thuần, không đọc DB.
- Đổi tên cookie hoặc thời hạn: sửa `utils/session-cookie.ts`, không sửa rải rác.
