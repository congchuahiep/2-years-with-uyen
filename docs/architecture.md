# Kiến trúc

Tài liệu này là nguồn sự thật về cách tổ chức code. Khi thói quen cũ trong repo mâu thuẫn với tài liệu này, tài liệu này thắng. Các tài liệu chuyên đề đi kèm:

- [import-boundaries.md](import-boundaries.md): bảng nơi import và vì sao barrel tạo vòng import.
- [naming.md](naming.md): bảng đặt tên file, export, thư mục.
- [resources.md](resources.md): mô hình resource valibot, FormData, `useActionState`.
- [page-pattern.md](page-pattern.md): page mỏng, `_components` / `_hooks` / `_lib`.
- README của từng feature: API và khái niệm riêng của feature.

## 1. Bối cảnh

Ứng dụng chỉ có hai người dùng, nên mọi quyết định ưu tiên **ít tầng, dễ đọc, ranh giới rõ** hơn là mở rộng quy mô. Backend dùng chính Next.js: Server Component đọc, Server Action ghi. Dữ liệu là SQLite (file khi dev, Turso khi deploy) qua Drizzle.

Bộ luật này học từ một client Next.js khác ở ba điểm: **barrel một chiều**, **resource schema là nguồn sự thật của type**, **page mỏng chia `_components` / `_hooks` / `_lib`**. Không mang theo HTTP client, TanStack Query, Zustand hay React Hook Form.

## 2. Cây thư mục

```text
src/
├── app/                          # chỉ routing shell
│   ├── layout.tsx
│   ├── page.tsx                  # cuốn sổ
│   ├── error.tsx
│   ├── login/page.tsx
│   ├── maintenance/page.tsx
│   └── api/music/
│       ├── search/route.ts       # vỏ mỏng gọi features/music/server.ts
│       └── [...path]/route.ts
├── configs/                      # hằng số hạ tầng: env, font, route
├── db/
│   ├── client.ts                 # kết nối lazy, server-only
│   └── schema.ts                 # bảng Drizzle
├── features/
│   └── <feature>/
│       ├── README.md             # API + khái niệm của feature
│       ├── index.ts              # barrel công khai (client-safe)
│       ├── actions.ts            # Server Action, client import được
│       ├── server.ts             # server-only, client không được chạm
│       ├── components/           # PascalCase.tsx + index.ts
│       ├── hooks/                # useXxx.ts + index.ts
│       ├── resources/            # <kebab>.ts + index.ts
│       ├── forms/                # <kebab>.ts + index.ts (nếu có)
│       ├── types/                # <kebab>.ts + index.ts
│       └── utils/                # <kebab>.ts + index.ts
├── shared/                       # dùng chung, KHÔNG barrel
│   ├── components/               # doodle kit, PascalCase.tsx
│   ├── hooks/                    # useXxx.ts
│   ├── icons/                    # PascalCase.tsx, đủ bộ icon
│   ├── providers/                # provider + context toàn cục
│   ├── types/                    # <kebab>.ts
│   └── utils/                    # <kebab>.ts
├── styles/globals.css
└── proxy.ts                      # middleware của Next
```

Ngoài `src/`:

- `drizzle/`: migration SQL sinh bởi drizzle-kit, commit vào repo.
- `data/`: file SQLite local, **không commit**.
- `scripts/`: seed tài khoản và ba script kiểm tra kiến trúc.
- `docs/`: tài liệu dự án.
- `.agents/skills/`: skill của agent, ví dụ `rough-component`.

## 3. Các tầng và chiều phụ thuộc

```text
app  ->  features  ->  shared
           |
           +------->  db, configs
```

- `app` được import barrel `@/features/<feature>`, hoặc `@/features/<feature>/server` khi page cần đọc dữ liệu. `app` không chứa logic nghiệp vụ.
- `features` import file cụ thể, kể cả khi dùng code của feature khác. Không import barrel, kể cả barrel của chính mình.
- `shared` không biết `features` và không biết `db`. Nó chỉ chứa component, hook, type, util thuần.
- `features` được import `db` và `configs`. `app` cũng được import `configs`.
- `db` chỉ chứa kết nối và schema; query thuộc feature nào nằm ở `server.ts` của feature đó.

Quy tắc này được máy kiểm bằng `bun run conventions` và `bun run cycles`.

## 4. Barrel và public API

Barrel là đặc quyền của `features/`. Mỗi thư mục con của feature có `index.ts`, feature có `index.ts` riêng, và `index.ts` chỉ chứa thứ client import được.

```ts
// app/page.tsx: đúng, app dùng barrel
import { Book } from "@/features/book";

// features/book/components/Book.tsx: đúng, trong feature dùng file cụ thể
import { INITIAL_LAYOUT } from "../utils/book-layout";

// features/book/components/Book.tsx: sai, barrel của chính feature
import { INITIAL_LAYOUT } from "@/features/book";
```

`import type` qua barrel vẫn bị xem là import barrel trong feature, vì lý do duy nhất cần barrel là gom runtime. Type dùng chung đặt ở `types/` và trỏ file cụ thể.

Chi tiết và bảng đầy đủ: [import-boundaries.md](import-boundaries.md).

## 5. Server và client

- Mặc định là Server Component. Chỉ thêm `"use client"` ở lá thực sự cần tương tác: drag, animation, form state.
- `server.ts` là file server-only: mở đầu bằng `import "server-only"`, không re-export từ `index.ts`. Dùng cho truy vấn DB, đọc secret, gọi API ngoài.
- `actions.ts` mở đầu bằng `"use server"`, được re-export từ `index.ts`. Mọi action phải tự xác thực session, parse input, ghi DB, `revalidatePath` khi dữ liệu hiển thị ở route khác.
- Route handler chỉ dùng khi cần endpoint HTTP thật: proxy API ngoài, webhook, serve file. Repo hiện chỉ có `/api/music/*` để tránh CORS và để axios không lọt vào bundle.
- Client không biết DB tồn tại. Không fetch DB từ client, không dựng API nội bộ cho việc mà Server Action làm được.

## 6. Dữ liệu và validate

- `db/schema.ts` là nguồn sự thật của tầng DB. Đổi bảng thì sửa file này rồi sinh migration.
- `features/<f>/resources/<kebab>.ts` là nguồn sự thật của type tầng app. Schema valibot đọc dữ liệu ở `server.ts`, và cũng là schema form khi form gửi đúng shape đó.
- Không DTO, không mapper. Tên field của resource trùng tên field trả về từ nguồn (camelCase với DB, snake_case với API ngoài như Deezer).
- Validate ở biên: `server.ts` khi đọc DB hoặc nhận response ngoài, `actions.ts` khi nhận `FormData`.
- `db/client.ts` và `features/auth/session.ts` là server-only. `configs/env.ts` parse env bằng valibot, gọi lazy để `next build` không đòi secret.

Chi tiết: [resources.md](resources.md).

## 7. Đặt tên

Tóm tắt, bảng đầy đủ ở [naming.md](naming.md):

| Loại | Tên file | Export |
|---|---|---|
| Component | `PascalCase.tsx` | một default, trùng tên file |
| Hook | `useXxx.ts` | một default, trùng tên file |
| Store | `PascalCase.ts` | một default, trùng tên file |
| Resource | `kebab-case.ts` | named: schema, type, hàm |
| Form schema | `kebab-case.ts` | named: `<Name>FormSchema`, type |
| Type | `kebab-case.ts` | named |
| Util | `kebab-case.ts` | named |
| Barrel | `index.ts` | re-export |
| Server | `server.ts`, `session.ts` | named, server-only |
| Action | `actions.ts` | named async function |

File framework của Next (`page.tsx`, `layout.tsx`, `route.ts`, `error.tsx`, `proxy.ts`, `next.config.ts`, `drizzle.config.ts`) và các file tổng hợp (`index.ts`, `actions.ts`) là ngoại lệ của luật một default export.

## 8. Page pattern

Page trong `app/` mỏng: đọc dữ liệu qua `server.ts`, render component của feature hoặc `_components` riêng của route. Phần tương tác tách vào `_hooks`, phần helper thuần vào `_lib`. Route con không import từ route cha.

Ví dụ đầy đủ: [page-pattern.md](page-pattern.md).

## 9. Tooling

| Lệnh | Việc |
|---|---|
| `bun run fmt` | `biome format --write`, chạy sau mỗi lần sửa code |
| `bun run check` | `tsc --noEmit` |
| `bun run cycles` | tìm vòng import runtime, exit 1 khi có vòng |
| `bun run conventions` | một default export, server-only, barrel, `"use server"` |
| `bunx biome lint src` | lint + luật tên file |
| `bun run lint` | eslint |

Thứ tự trước khi commit: `fmt`, `check`, `cycles`, `conventions`.

Luật tên file của Biome bật cho `src/**` (trừ `src/app/**`): component và provider PascalCase, hook camelCase, còn lại kebab-case. `index.ts` được miễn.

## 10. Những thứ đã bị loại bỏ có chủ đích

Ghi lại để người sau không vô tình đưa chúng trở lại:

- **Supabase**: thay bằng SQLite/Turso, session cookie và Drizzle.
- **TanStack Query**: dữ liệu đọc ở Server Component, ghi ở Server Action. Client không query DB, không có tầng API trung gian.
- **Zod**: valibot là thư viện schema duy nhất.
- **Namespace**: resource dùng named export, không dùng `namespace`.
- **Moment, quest, trivia, profile**: không còn là phần của ứng dụng.
- **Editor cũ**: đang được thiết kế lại; sổ hiện read-only.

`features/timeline` và `features/music` được giữ như feature độc lập, chưa route tới.

## 11. Checklist khi thêm một feature

1. Tạo `features/<feature>/` với đúng thư mục cần dùng, kèm `README.md`.
2. Tạo `index.ts` cho từng thư mục con và cho feature, chỉ export thứ client-safe.
3. Có đọc DB hoặc secret: đặt ở `server.ts`, mở đầu bằng `import "server-only"`.
4. Có mutation: đặt ở `actions.ts`, mở đầu bằng `"use server"`, tự xác thực session và parse bằng valibot.
5. Khai báo resource ở `resources/<kebab>.ts` trước khi viết query, để type đi từ schema.
6. Route trong `app/` chỉ import barrel feature hoặc `features/<feature>/server`.
7. Chạy `bun run fmt`, `bun run check`, `bun run cycles`, `bun run conventions`.
