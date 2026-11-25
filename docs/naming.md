# Đặt tên

Một file là một khái niệm, và tên file phải nói ra khái niệm đó. Bảng dưới là luật đầy đủ; ví dụ đúng lấy từ code thật trong repo.

## 1. Bảng tên file

| Loại | Tên file | Export | Ví dụ đúng |
|---|---|---|---|
| Component | `PascalCase.tsx` | đúng một default, trùng tên file | [RoughBox.tsx](../src/shared/components/RoughBox.tsx) |
| Icon | `PascalCase.tsx` | đúng một default, trùng tên file | [ArrowIcon.tsx](../src/shared/icons/ArrowIcon.tsx) |
| Provider | `PascalCase.tsx` | đúng một default | [ModalProvider.tsx](../src/shared/providers/ModalProvider.tsx) |
| Context value | `PascalCase.ts` | named, trùng tên file | [ModalContext.ts](../src/shared/providers/ModalContext.ts) |
| Hook | `useXxx.ts` | đúng một default | [useBookLayout.ts](../src/features/book/hooks/useBookLayout.ts) |
| Store | `PascalCase.ts` (chưa có trong repo) | đúng một default | - |
| Resource | `kebab-case.ts` | named: `XSchema`, `type X`, hàm | [deezer-track.ts](../src/features/music/resources/deezer-track.ts) |
| Form schema | `kebab-case.ts` | named: `XFormSchema`, `type XForm` | [login-form.ts](../src/features/auth/forms/login-form.ts) |
| Type | `kebab-case.ts` | named | [page-face.ts](../src/features/book/types/page-face.ts) |
| Util | `kebab-case.ts` | named | [book-layout.ts](../src/features/book/utils/book-layout.ts) |
| Barrel | `index.ts` | re-export | [book/index.ts](../src/features/book/index.ts) |
| Server | `server.ts` | named, `import "server-only"` | [auth/server.ts](../src/features/auth/server.ts) |
| Server Action | `actions.ts` | named async function | [auth/actions.ts](../src/features/auth/actions.ts) |
| Route | `page.tsx`, `layout.tsx`, `route.ts`, `error.tsx` | theo Next | `src/app/login/page.tsx` |

Thư mục: `src/features/<feature>` dùng kebab-case (`auth`, `book`, `music`, `timeline`). Thư mục private trong `app` bắt đầu bằng gạch dưới: `_components/`, `_hooks/`, `_lib/`.

## 2. Vì sao resource, type, form là kebab-case

Component, hook, store là **một giá trị duy nhất**, nên default export và tên file trùng nhau giúp đọc import là biết ngay đang dùng gì:

```ts
import RoughBox from "@/shared/components/RoughBox";
import useBookLayout from "@/features/book/hooks/useBookLayout";
```

Resource, type, form, util chứa **nhiều thứ liên quan**: schema, type, hằng số, hàm. Chúng dùng named export và tên file kebab-case:

```ts
import { DeezerTrackSchema, type DeezerTrack } from "../resources/deezer-track";
import { INITIAL_LAYOUT, PORTRAIT_BREAKPOINT } from "../utils/book-layout";
```

## 3. Ví dụ sai và cách sửa

| Sai | Vì sao | Sửa |
|---|---|---|
| `components/book-page.tsx` | component phải PascalCase | `components/BookPage.tsx` |
| `types/BookData.ts` | type phải kebab-case | `types/book-data.ts` |
| `resources/DeezerTrack.ts` | resource phải kebab-case | `resources/deezer-track.ts` |
| `forms/LoginForm.ts` | form schema phải kebab-case | `forms/login-form.ts` |
| `hooks/use-book-layout.ts` | hook phải camelCase, bắt đầu `use` | `hooks/useBookLayout.ts` |
| `components/Book.tsx` export `export function Book` | component phải default export | `export default function Book` |
| `components/Book.tsx` export thêm `BookProps`, `FlipBookControl` | một file một export chính; type dùng ngoài chuyển sang `types/` | `types/book-props.ts` nếu cần dùng ngoài, còn không khai báo nội bộ |
| `types/rough.ts` export `FillStyle` và `Options` | type dùng ngoài nằm ở file riêng theo tên khái niệm | tách `types/fill-style.ts` khi cần |

## 4. Ngoại lệ

- File framework: `page.tsx`, `layout.tsx`, `route.ts`, `error.tsx`, `proxy.ts`, `next.config.ts`, `drizzle.config.ts`. Next quy định tên, không đổi.
- File tổng hợp: `index.ts` và `actions.ts` không theo luật một default export.
- `actions.ts` chỉ export hàm async. Type dùng ngoài (như `AuthState`) chuyển sang `types/auth-state.ts`.
- File có `"use client"` vẫn giữ quy ước theo loại khái niệm, không đổi tên.

## 5. Máy kiểm cái gì

`bun run conventions` kiểm component/hook/store có đúng một default export và tên trùng tên file. Biome kiểm case của tên file cho `src/**`, trừ `src/app/**` (Next tự lo) và `index.ts`.

### Quyết định về `useFilenamingConvention`

Đề xuất ban đầu là một override duy nhất cho `src/**` với `filenameCases: ["PascalCase", "export"]`. Chạy thử thì không dùng được:

- Case `"export"` chỉ áp dụng cho file có **một** export. Resource, type, util có nhiều named export nên bị báo lỗi ngay cả khi tên file đúng.
- `PascalCase` cho toàn `src/**` sẽ báo lỗi mọi hook (`useDebounce.ts`) và mọi file kebab (`deezer-track.ts`).

Vì vậy cấu hình được tách theo thư mục, và case `"export"` được thay bằng kiểm tra mạnh hơn trong `bun run conventions` (so tên file với tên default export trên toàn repo):

```jsonc
// biome.json, các override cho src/**
// component, icon, provider, feature/components
{ "filenameCases": ["PascalCase"] }
// hook
{ "filenameCases": ["camelCase"] }
// còn lại: resource, type, util, actions, server
{ "filenameCases": ["kebab-case"] }
```

`src/app/**` và `index.ts` được miễn. Sau khi sửa code, luôn chạy `bun run fmt` trước khi `check`, `cycles`, `conventions`.
