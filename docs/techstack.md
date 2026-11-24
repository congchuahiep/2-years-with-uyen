# Công nghệ cốt lõi

## Nền tảng

- **Next.js 16 (App Router)** — routing, Server Components để đọc dữ liệu, Server Actions để ghi, `proxy.ts` thay cho middleware.
- **React 19** và **TypeScript**.
- Build và start chạy trên Node (`next build`, `next start`). `bun --bun next dev` chỉ dùng cho dev.

## Giao diện

- **Tailwind CSS 4** với biến CSS trong `src/styles/globals.css`.
- **tailwind-variants** — nguồn duy nhất cho `cn` và `tv`; không dùng `clsx`/`tailwind-merge` trực tiếp.
- **motion** — animation lật trang, scroll timeline, drag.
- **react-pageflip** — engine lật trang của cuốn sổ.
- **Rough.js** và **react-rough-notation** — nét vẽ tay, gạch chân, khung ngoằn ngoèo.
- Font viết tay (Pangolin, Fuzzy Bubbles, Corinthia) qua `next/font/google` trong `src/configs/font.ts`.

## Dữ liệu

- **SQLite** khi dev (`file:./data/app.db`) và **Turso** khi deploy — cùng một driver `@libsql/client`.
- **Drizzle ORM** cho schema và truy vấn; **drizzle-kit** sinh migration vào `drizzle/`.
- Kết nối nằm ở `src/db/client.ts`, có `import "server-only"`; schema ở `src/db/schema.ts`.
- Không truy vấn DB từ client. Query thuộc feature nào nằm ở `server.ts` của feature đó.

## Auth

- Bảng `users` trong SQLite; mật khẩu hash bằng **scrypt** của Node (`node:crypto`).
- Session là **JWT HS256** ký bằng `SESSION_SECRET`, lưu trong cookie `httpOnly`, `sameSite=lax`, 30 ngày.
- `proxy.ts` chỉ verify chữ ký, không truy vấn DB.

## Media (kế hoạch)

- **Cloudinary** cho ảnh và video: `f_auto`/`q_auto` để trả WebP/AVIF, video hạ 720p/30fps.
- Upload trực tiếp từ trình duyệt bằng chữ ký do server cấp, tránh giới hạn body của Vercel.
- Chưa triển khai; schema nội dung sẽ được chốt cùng editor mới.

## Đã loại bỏ có chủ đích

Supabase (Auth/Postgres/Storage), TanStack Query, Moment, quest/trivia/profile, editor freeform cũ.
