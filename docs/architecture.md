# Kiến trúc & Convention

Tài liệu này là nguồn sự thật về cách tổ chức code của dự án sau khi chuyển sang kiến trúc feature. Khi thói quen cũ trong repo mâu thuẫn với tài liệu này, tài liệu này thắng.

## 1. Bối cảnh

Ứng dụng chỉ có hai người dùng, nên mọi quyết định kiến trúc ưu tiên **ít tầng, dễ đọc, ranh giới rõ** hơn là mở rộng quy mô. Backend dùng chính Next.js (Server Components để đọc, Server Actions để ghi) và SQLite qua `@libsql/client` (file khi dev/self-host, Turso khi chạy trên Vercel). Không còn Supabase, không còn TanStack Query — hai thứ này từng tồn tại nhưng đã bị loại bỏ có chủ đích, xem mục 9.

## 2. Cây thư mục

```text
src/
├── app/                  # chỉ routing shell, file mỏng
│   ├── login/page.tsx
│   ├── book/page.tsx
│   └── api/media/[...key]/route.ts
├── configs/              # hằng số dùng chung: font, route, env
├── shared/               # dùng chung toàn dự án
│   ├── components/       # doodle kit: rough-box, button, polaroid…
│   ├── icons/            # toàn bộ icon, kể cả chưa dùng
│   ├── providers/        # provider toàn cục
│   ├── hooks/
│   ├── types/
│   ├── utils/            # cn, color, hash, audio
│   └── db/               # client + schema + migrations (server-only)
├── features/
│   └── <tên-feature>/
│       ├── components/
│       ├── hooks/
│       ├── services/     # logic thuần, không phụ thuộc React
│       ├── types/
│       ├── utils/
│       ├── actions.ts    # Server Actions — client được phép import
│       ├── server.ts     # chỉ server dùng — client TUYỆT ĐỐI không import
│       └── index.ts      # barrel công khai của feature
└── styles/
```

`app/` chỉ chứa route, layout và metadata. Không viết logic nghiệp vụ trong `app/`; file route chỉ import từ barrel của feature hoặc từ `shared/`.

`shared/` là nơi đặt thứ mà **từ hai feature trở lên** cùng cần. Một feature không được "mượn" code nội bộ của feature khác bằng deep import.

**`shared/` không có barrel export.** Không tạo `index.ts` trong `shared/components`, `shared/icons`, `shared/utils` hay bất kỳ thư mục con nào của `shared`. Lý do: `shared` là tập hợp các đơn vị độc lập, gom chúng vào một cửa chỉ làm bundle khó tree-shake và dễ tạo vòng lặp import. Nơi dùng trỏ thẳng file: `@/shared/components/rough-box`, `@/shared/utils/cn`.

Mỗi thư mục con trong `features/<tên-feature>/` có `index.ts` riêng, và `features/<tên-feature>/index.ts` re-export lại các barrel đó. Thư mục không dùng thì không tạo — repo không cần `services/` rỗng cho đẹp cây.

## 3. Quy tắc barrel

Barrel là đặc quyền của `features/`. `shared/` không có barrel, import trực tiếp file cụ thể.

Quy tắc bắt buộc: **code ngoài feature chỉ import từ `@/features/<tên-feature>`**, không đi sâu vào file cụ thể.

```ts
// Đúng
import { Book, type BookData } from "@/features/book";

// Sai — kể cả khi IDE tự gợi ý
import { Book } from "@/features/book/components/book";
```

### 3.1 `index.ts` chỉ được chứa code client-safe

`index.ts` là thứ client component được phép import, nên nó **không bao giờ** re-export từ `server.ts`. Một dòng `export * from "./server"` trong `index.ts` là đủ để kéo truy vấn DB và connection string vào bundle trình duyệt.

### 3.2 `server.ts` re-export thẳng file server, không qua barrel con

Khi một file chỉ server dùng nằm trong thư mục con, nó **không** được đưa vào `index.ts` của thư mục đó. `server.ts` sẽ re-export thẳng file nguồn:

```text
features/book/
├── utils/
│   ├── index.ts                # KHÔNG export server-item-only
│   └── server-item-only.ts     # có "server-only" ở đầu
├── server.ts                   # export * from "./utils/server-item-only"
└── index.ts                    # export * from "./utils"  (không chạm server)
```

Nhờ vậy `index.ts` không có đường nào tới file server, còn server code vẫn được gom về một cửa.

Rủi ro còn lại là người sau thêm `export * from "./utils/server-item-only"` vào `utils/index.ts`. Để lỗi đó thành lỗi build thay vì lỗi bảo mật im lặng, **mọi file server-only phải bắt đầu bằng**:

```ts
import "server-only";
```

Package `server-only` biến việc import từ client thành lỗi biên dịch.

### 3.3 `actions.ts` khác `server.ts`

Server Action là hàm chạy trên server nhưng **client được phép import** — đó là điểm khác biệt căn bản với `server.ts`. Vì vậy Server Action nằm ở `actions.ts`, có thể được re-export từ `index.ts`:

```ts
// features/book/actions.ts
"use server";

export async function movePageItem(input: MovePageItemInput) {
  // xác thực session, validate bằng zod, ghi DB, revalidate
}
```

`server.ts` dành cho thứ client không bao giờ được chạm: truy vấn DB, đọc secret, ghi file. Nếu một hàm vừa cần client gọi vừa cần đọc secret, nó là Server Action và phải tự xác thực session ở đầu.

## 4. Ranh giới server / client

- Mặc định là Server Component. Chỉ thêm `"use client"` ở lá thực sự cần tương tác (drag, animation, form state).
- Không fetch DB từ client. Client không biết DB tồn tại.
- Server Component đọc dữ liệu bằng cách gọi hàm trong `server.ts`, không gọi qua HTTP nội bộ.
- Mutation là Server Action. Không dựng route handler chỉ để làm việc mà Server Action làm được.
- Route handler chỉ dùng khi cần một endpoint HTTP thật: webhook, serve file, upload trực tiếp, hoặc API cho bên ngoài.
- Mọi Server Action phải: xác thực session → validate input bằng zod → ghi DB → `revalidatePath`/`revalidateTag` nếu dữ liệu hiển thị ở route khác.

## 5. Tầng dữ liệu

- `shared/db/client.ts` tạo kết nối duy nhất, bắt đầu bằng `import "server-only"`.
- `shared/db/schema.ts` khai báo schema Drizzle.
- `shared/db/migrations/` chứa migration SQL, sinh bằng `drizzle-kit` và commit vào repo.
- Query thuộc feature nào thì nằm ở `server.ts` của feature đó, không nằm trong `shared/db`.
- Khi đọc DB trong Server Component trên Next 16, gọi `connection()` trước truy vấn nếu driver là loại đồng bộ — Next có thể coi dữ liệu đó là tĩnh và prerender lúc build.

## 6. Styling

- `cn` lấy từ `tailwind-variants`, không tự viết lại bằng `clsx` + `tailwind-merge`. Một nguồn duy nhất: `shared/utils/cn.ts`.
- Component có biến thể (size, color, state) dùng `tv()` thay vì chuỗi điều kiện.
- Icon là asset lâu dài: nằm ở `shared/icons/`, **không xoá icon chỉ vì hiện chưa ai import**. Khi cần dùng lại, import từ `@/shared/icons`.

## 7. Đặt tên

| Loại | Quy ước | Ví dụ |
|---|---|---|
| Thư mục, file | kebab-case | `book-editor.tsx`, `use-flipbook.ts` |
| Component, type | PascalCase | `BookEditor`, `BookData` |
| Hook | camelCase, bắt đầu `use` | `useBookEditor` |
| Barrel | luôn là `index.ts` | `features/book/index.ts` |
| File server | `server.ts`, `actions.ts` | cố định, không đổi tên |

## 8. Nhánh

- `old-design` — bản cũ còn chạy được (timeline, Moment, Supabase). Giữ nguyên để đối chiếu và làm fallback; không phát triển tiếp trên nhánh này.
- `rewrite/book-sqlite` — nhánh refactor sang kiến trúc feature + SQLite.
- `main` — đích đến cuối cùng, chỉ merge khi refactor xong và đã kiểm tra.

## 9. Những thứ đã bị loại bỏ có chủ đích

Ghi lại để người sau không vô tình đưa chúng trở lại:

- **Supabase** (Auth, Postgres, Storage) — thay bằng SQLite/Turso, session cookie và object storage.
- **TanStack Query** — dữ liệu đọc ở Server Component, mutation ở Server Action. Lý do: DB nằm trên server, client không query được; giữ TanStack sẽ buộc phải dựng thêm một tầng API không cần thiết cho một app hai người dùng.
- **Moment và các route/UI gắn với Moment** — trang chủ timeline cũ, form tạo Moment, modal chi tiết và toàn bộ hook/store liên quan đã bị xoá. Nội dung cuốn sổ sẽ do feature `book` tự định nghĩa.
- **Quest / trivia / profile** — không còn là phần của ứng dụng.

Hai thứ được giữ lại có chủ đích dưới dạng feature độc lập:

- `features/timeline` — timeline cuộn, nhưng không còn biết `Moment` là gì: nó nhận danh sách item chung và hàm render do nơi dùng truyền vào.
- `features/music` — tìm và phát nhạc qua Deezer, gồm component tìm kiếm, types và proxy phía server (`server.ts`, có `import "server-only"`). Route handler trong `app/api/music` chỉ còn là vỏ mỏng gọi vào feature.

## 10. Checklist khi thêm một feature

1. Tạo `features/<tên>/` với đúng các thư mục thực sự cần.
2. Tạo `index.ts` cho từng thư mục con và `index.ts` cho feature.
3. Nếu có code server: đặt ở `server.ts` hoặc `utils/server-*.ts`, kèm `import "server-only"`, và không export qua barrel con.
4. Nếu có mutation: đặt ở `actions.ts`, validate bằng zod, kiểm tra session.
5. Route trong `app/` chỉ được import từ `@/features/<tên>`, không deep import.
6. Chạy `bunx tsc --noEmit` trước khi commit.
