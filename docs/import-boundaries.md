# Ranh giới import

Luật một câu: **đi một chiều, và chỉ app được dùng cửa chính của feature.**

## 1. Bảng nơi import

| Nơi đặt code | Được import | Không được import |
|---|---|---|
| `src/app/**` | `@/features/<f>` (barrel), `@/features/<f>/server`, `@/shared/...`, `@/configs/...` | file nội bộ của feature (`@/features/book/components/Book`), `@/db/**` |
| `src/features/<f>/**` | file cụ thể trong cùng feature, `@/shared/...`, `@/db/...`, `@/configs/...`, file cụ thể của feature khác | bất kỳ `index.ts` nào (kể cả của chính feature), barrel feature khác |
| `src/shared/**` | `@/shared/...` | `@/features/**`, `@/db/**`, `@/configs/**` |
| `src/db/**` | `@/configs/...`, thư viện ngoài | `@/features/**`, `@/shared/**` |
| `src/configs/**` | thư viện ngoài | `@/features/**`, `@/db/**`, `@/shared/**` |

Ghi chú:

- `app` được import `@/features/<f>/server` vì page mặc định là Server Component và cần đọc dữ liệu. Đây là ngoại lệ duy nhất của luật "app dùng barrel".
- `import type` qua barrel **không** được miễn trong `features`: type dùng chung đặt ở `types/`, trỏ file cụ thể. `import type` chỉ được phép khi nó là cách duy nhất để mô tả prop của một component public.
- Feature chéo nhau: import file cụ thể, ví dụ `@/features/music/resources/deezer-track`. Không import `@/features/music`.

## 2. Vì sao barrel tạo vòng import runtime

Barrel là một module thật. Khi `features/a/index.ts` re-export `components/A.tsx`, chạy `import ... from "@/features/a"` sẽ nạp `index.ts` trước, rồi `index.ts` mới nạp `A.tsx`. Nếu `A.tsx` lại import `@/features/b`, và `b/index.ts` import ngược về `@/features/a`, ta có vòng:

```text
a/index.ts -> a/components/A.tsx -> b/index.ts -> a/index.ts
```

Với ESM, vòng này không bị chặn lúc build. Nó chỉ nổ lúc chạy, khi một `const` được đọc trước khi module khai báo nó xong:

```ts
// a/index.ts
export { A } from "./components/A";
// a/components/A.tsx
import { B } from "@/features/b";
// b/index.ts
export { B } from "./B";
// b/B.tsx
import { A } from "@/features/a"; // quay lại a/index.ts
```

Triệu chứng thường gặp: `ReferenceError: Cannot access 'A' before initialization` (TDZ), `undefined is not a function`, hoặc component render ra `undefined` chỉ ở production vì thứ tự module khác dev.

`import type` không tạo vòng vì TypeScript xóa nó khi compile. Vì vậy script `cycles` bỏ qua các cạnh type-only.

Cách chặn:

1. Trong feature, không import barrel. Mỗi file trỏ thẳng file nó cần, nên đồ thị phụ thuộc là DAG theo file.
2. `index.ts` chỉ là cửa cho `app`, không phải cửa cho code nội bộ.
3. `bun run cycles` chạy Tarjan trên đồ thị runtime, exit 1 khi có vòng. Script resolve được `@/` và `index.ts`, khác `madge`.

## 3. `server-only` và barrel

`index.ts` là thứ client import được, nên nó không bao giờ được re-export file bắt đầu bằng:

```ts
import "server-only";
```

Một dòng `export * from "./server"` là đủ để kéo truy vấn DB và connection string vào bundle trình duyệt. `bun run conventions` kiểm cả trường hợp re-export gián tiếp qua barrel con.

Quy ước đặt code server:

| File | Vai trò | Client import |
|---|---|---|
| `server.ts` | truy vấn DB, đọc secret, gọi API ngoài | không |
| `session.ts`, `password.ts` | session, hash | session: không; password: chỉ script seed |
| `services/<kebab>.ts` có `import "server-only"` | client HTTP riêng của server | không |
| `actions.ts` | Server Action | có, qua barrel |

`server.ts` không bị re-export từ `index.ts`, nhưng `app` được import trực tiếp khi cần đọc dữ liệu.

## 4. Checklist khi review một PR

- [ ] Không có `import ... from "@/features/<f>"` trong `src/features/**`.
- [ ] Không có import nào trong `src/shared/**` trỏ tới `features`, `db`, `configs`.
- [ ] `index.ts` không chạm file có `import "server-only"`.
- [ ] File server-only có `import "server-only"` ở **dòng đầu tiên**.
- [ ] `actions.ts` có `"use server"` và tự xác thực session.
- [ ] `bun run cycles` và `bun run conventions` xanh.
