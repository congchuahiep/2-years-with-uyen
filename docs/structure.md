# Cấu trúc dự án

Dự án dùng kiến trúc feature: `app/` chỉ là vỏ routing, logic nằm trong `features/`, thứ dùng chung nằm trong `shared/`.

```text
src/
├── app/
│   ├── page.tsx            # cuốn sổ
│   ├── login/page.tsx
│   ├── maintenance/page.tsx
│   ├── api/music/...       # route handler mỏng
│   ├── layout.tsx
│   └── error.tsx
├── configs/                # env, font, route
├── db/
│   ├── client.ts           # kết nối lazy, server-only
│   └── schema.ts           # bảng Drizzle
├── features/
│   ├── auth/               # actions, server, session, password
│   ├── book/               # components + types của cuốn sổ
│   ├── music/              # tìm/phát nhạc, proxy Deezer
│   └── timeline/           # timeline cuộn generic
├── shared/                 # components, hooks, icons, providers, types, utils
├── styles/
└── proxy.ts
```

## Quy tắc đặt code

- Route file trong `app/` chỉ import từ barrel feature hoặc file cụ thể trong `shared/`.
- Mỗi thư mục con của feature có `index.ts`; feature có `index.ts` riêng.
- `server.ts` chỉ server dùng, không bao giờ được re-export từ `index.ts`.
- `actions.ts` chứa Server Action, được re-export từ `index.ts`.
- `shared/` **không có barrel**; import trực tiếp file.
- Không tạo thư mục rỗng chỉ để đủ cây.

Chi tiết và ví dụ: [architecture.md](architecture.md).

## Ngoài `src/`

- `drizzle/` — migration SQL và metadata, commit vào repo.
- `data/` — file SQLite local, **không commit**.
- `scripts/` — script một lần như seed tài khoản.
- `.agents/skills/` — skill cho agent (`rough-component`).
- `docs/` — tài liệu dự án.
