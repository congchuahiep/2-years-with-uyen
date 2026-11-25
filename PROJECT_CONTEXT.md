# Project Context — 2 Years with Uyen

## Mục tiêu

Một món quà cá nhân cho hai người: cuốn sổ lật phong cách scrapbook/doodle, lưu ảnh và kỷ niệm, không phải mạng xã hội mở. Mọi quyết định ưu tiên ít tầng, dễ đọc và ranh giới server/client rõ ràng.

## Trạng thái hiện tại

- Nền tảng đã chuyển sang Next.js App Router + kiến trúc feature.
- Convention đã viết lại: barrel một chiều, PascalCase cho component, resource valibot, script kiểm tự động (`check`, `cycles`, `conventions`).
- Dữ liệu dùng SQLite (file khi dev, Turso khi deploy) qua Drizzle.
- Auth dùng bảng `users`, mật khẩu hash scrypt, session cookie JWT.
- Sổ đang **read-only**: chỉ bìa, 5 trang intro và trang kết. Editor cũ đã bị xoá và đang được thiết kế lại.
- Đã loại bỏ: Supabase, Moment, quest/trivia/profile, TanStack Query, editor cũ.
- `features/timeline` và `features/music` được giữ lại như feature độc lập, chưa route tới.

## Kiến trúc

```text
src/
├── app/        # route mỏng, dùng barrel @/features/<f>
├── configs/    # env (valibot), font, route
├── db/         # schema + client (server-only)
├── features/   # auth, book, music, timeline - có barrel
└── shared/     # dùng chung, KHÔNG barrel
```

- Server Component đọc dữ liệu; Server Action ghi. Không dùng TanStack Query.
- `features/<x>/server.ts` chỉ server dùng và không được re-export từ `index.ts`; `actions.ts` thì được.
- Trong `features/**` luôn import file cụ thể, không import barrel. `shared/` không có `index.ts`.
- Valibot là thư viện schema duy nhất. Resource ở `resources/<kebab>.ts` là nguồn sự thật của type tầng app.
- Component, hook, store: một default export, tên file trùng tên export.
- Chi tiết đầy đủ: [docs/architecture.md](docs/architecture.md).

## Lệnh thường dùng

```bash
bun run dev
bun run build
bun run fmt          # biome format --write, chạy sau mỗi lần sửa code
bun run check        # tsc --noEmit
bun run cycles       # tìm vòng import runtime
bun run conventions  # luật barrel, default export, server-only
bun run db:generate
bun run db:migrate
SEED_EMAIL=... SEED_PASSWORD=... bun run db:seed
```

## Biến môi trường

`DATABASE_URL`, `DATABASE_AUTH_TOKEN` (chỉ Turso), `SESSION_SECRET` (>= 32 ký tự). Mẫu ở `.env.example`; `.env` và `data/` không được commit.

## Việc không nên làm

- Không thêm barrel vào `shared/`.
- Không import barrel trong `src/features/**`, kể cả barrel của chính feature mình.
- Không import `server.ts` từ client component, không re-export nó từ `index.ts`.
- Không dùng zod, `namespace`, DTO hay mapper. Schema duy nhất là valibot.
- Không đặt component PascalCase vào `app/` trừ file framework của Next.
- Không đưa Supabase, Moment, quest hay TanStack trở lại.
- Không commit `.env`, `data/` hoặc file `.db`.
