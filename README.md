# 2 Years with Uyen — Sổ lưu niệm

Ứng dụng web cá nhân làm món quà kỷ niệm 2 năm: một cuốn sổ lật (flipbook) phong cách doodle, chỉ hai người dùng truy cập được.

## Trạng thái hiện tại

- `/` mở cuốn sổ: bìa, 5 trang intro, trang kết. Sổ đang **read-only** — editor và mô hình nội dung đang được thiết kế lại nên chưa có trang động.
- `/login` xác thực email/mật khẩu với bảng `users` trong SQLite; session là cookie JWT.
- `/maintenance` dùng khi bật `MAINTENANCE_MODE=true`.
- Hai feature được giữ lại nhưng chưa route tới: `features/timeline` (timeline cuộn generic) và `features/music` (tìm/phát nhạc qua Deezer).

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 + tailwind-variants · motion · react-pageflip · Rough.js · SQLite/Turso qua Drizzle + `@libsql/client` · `jose` + scrypt cho auth.

## Cấu trúc

```text
src/
├── app/        # route mỏng: /, /login, /maintenance, /api/music
├── configs/    # env, font, route
├── db/         # schema + client Drizzle (server-only)
├── features/   # auth, book, music, timeline
└── shared/     # components, hooks, icons, providers, types, utils
```

Quy ước chi tiết nằm ở [docs/architecture.md](docs/architecture.md). Đọc file đó trước khi thêm code.

## Chạy local

```bash
bun install
cp .env.example .env
# sửa .env: SESSION_SECRET (tối thiểu 32 ký tự), DATABASE_URL trỏ tới `file:./data/app.db`
bun run db:migrate
SEED_EMAIL=ban@example.com SEED_PASSWORD="..." SEED_NAME="Hiệp" bun run db:seed
bun run dev
```

Mặc định `DATABASE_URL` trỏ tới `file:./data/app.db` và tạo file trong `data/` (đã gitignore). Khi dùng Turso, đổi URL, thêm `DATABASE_AUTH_TOKEN`, rồi chạy lại `db:migrate`.

## Scripts

| Lệnh | Việc |
|---|---|
| `bun run dev` | Next dev dưới Bun |
| `bun run build` | Next build dưới Node |
| `bun run lint` | ESLint |
| `bun run db:generate` | Sinh migration từ schema |
| `bun run db:migrate` | Áp migration |
| `bun run db:seed` | Tạo/cập nhật một tài khoản |

## Nhánh

- `rewrite/book-sqlite` — nhánh refactor hiện tại.
- `old-design` — bản cũ (timeline, Moment, Supabase), giữ làm tham chiếu.
- `main` — đích đến khi refactor xong.

## Tài liệu

[architecture.md](docs/architecture.md) (quy ước bắt buộc) · [techstack.md](docs/techstack.md) · [structure.md](docs/structure.md) · [features.md](docs/features.md) · [plan.md](docs/plan.md). `docs/new-plan.md` là kế hoạch lịch sử của thời FlipBook + Supabase, không còn hiệu lực.
