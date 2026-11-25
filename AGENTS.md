<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Luật kiến trúc (luôn áp dụng)

- `src/app/**` chỉ import barrel `@/features/<feature>`. Trong `src/features/**` luôn import file cụ thể, kể cả file của feature khác. Không import barrel của chính feature mình.
- `src/shared/**` không có barrel (`index.ts`); import trực tiếp file cụ thể.
- `index.ts` không bao giờ re-export file bắt đầu bằng `import "server-only"`.
- `server.ts` chỉ server import, không re-export từ `index.ts`. `actions.ts` client import được, được re-export từ `index.ts`.
- Mọi Server Action phải tự xác thực session, parse input bằng valibot, ghi DB, revalidate khi cần.
- Valibot là thư viện schema duy nhất cho resource và form. Không zod, không validate tay.
- Component, hook, store: đúng một default export, tên file trùng tên export. Type và hằng số cần dùng ngoài file chuyển sang `types/<kebab>.ts` hoặc `utils/<kebab>.ts`.
- Resource: `resources/<kebab>.ts`, named export, thứ tự hằng số, schema, type, hàm. Không dùng `namespace`, không DTO, không mapper.
- Db schema là nguồn sự thật của tầng DB; resource schema là nguồn sự thật của type tầng app. Validate ở `server.ts` khi đọc DB, ở `actions.ts` khi nhận input.
- Trước khi commit: `bun run fmt`, `bun run check`, `bun run cycles`, `bun run conventions`.

Chi tiết: [docs/architecture.md](docs/architecture.md), [docs/import-boundaries.md](docs/import-boundaries.md), [docs/naming.md](docs/naming.md), [docs/resources.md](docs/resources.md), [docs/page-pattern.md](docs/page-pattern.md).

## Quy chuẩn

- Không dùng em dash `—`, dùng `-` hoặc dấu phẩy.
- Comment tiếng Việt.
- JSDoc: không bao giờ viết comment doc 1 dòng dù ngắn, luôn mở rộng nhiều dòng.
    ```ts
    /** SAI */

    /**
     * ĐÚNG
     */
    ```
