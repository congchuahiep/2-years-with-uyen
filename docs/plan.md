# Kế hoạch hiện tại

## Đã xong

- Chuyển toàn bộ code sang kiến trúc feature; `shared/` không barrel.
- Bỏ trang chủ timeline, Moment, profile, quest/trivia và modal routes.
- Cuốn sổ thành read-only; xoá editor freeform cũ.
- Thay Supabase bằng SQLite/Turso + Drizzle; thay Supabase Auth bằng users + cookie JWT.
- Bỏ TanStack Query; giữ timeline và music thành feature độc lập.
- Giữ build xanh: `bunx tsc --noEmit` và `bun run build`.
- Viết lại convention: barrel một chiều, component PascalCase, resource valibot, script `check` / `cycles` / `conventions`.

## Tiếp theo

1. **Thiết kế lại editor + mô hình nội dung** — ảnh, ghi chú, sticker; chưa chốt schema.
2. **Media pipeline** — Cloudinary: upload trực tiếp bằng chữ ký, ảnh WebP/AVIF, video 720p30.
3. **Nối sổ với dữ liệu mới** — thay `faces={[]}` bằng dữ liệu thật, thêm `features/book/server.ts`.
4. **Deploy** — Vercel + Turso; đặt `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `SESSION_SECRET`, chạy migration và seed hai tài khoản.
5. **Dọn cuối** — rà lại docs, dependency và lint.

## Quyết định đã chốt

| Chủ đề | Quyết định |
|---|---|
| Host DB | Turso (libSQL), file SQLite khi dev |
| ORM | Drizzle + drizzle-kit |
| Auth | Hai tài khoản trong SQLite, scrypt, JWT cookie |
| Media | Cloudinary (khi làm editor) |
| Data fetching | Next-native: Server Components + Server Actions |
| Editor | Viết lại từ đầu; bản cũ chỉ là nháp |
