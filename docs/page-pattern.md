# Page pattern

Page trong `app/` là chỗ lắp ráp, không phải chỗ chứa logic. Nó làm đúng ba việc: đọc dữ liệu, chọn component, đặt metadata.

## 1. Luồng dữ liệu

```text
page.tsx (server)
  -> features/<f>/server.ts   (đọc DB, validate bằng resource)
  -> component của feature    (render)
       -> _hooks/useXxx.ts    (tương tác client)
       -> actions.ts          (ghi DB, revalidate)
```

- Đọc: page gọi thẳng `@/features/<f>/server`, không qua HTTP nội bộ.
- Ghi: form hoặc nút gọi Server Action trong `features/<f>/actions.ts`.
- Sau khi ghi: action gọi `revalidatePath` cho route hiển thị dữ liệu đó.

## 2. Page mỏng

Ví dụ thật, [app/page.tsx](../src/app/page.tsx):

```tsx
import type { Metadata } from "next";
import { logout } from "@/features/auth";
import { Book } from "@/features/book";

export const metadata: Metadata = {
  title: "Sổ kỷ niệm",
  description: "Cuốn sổ lật lưu giữ kỷ niệm của Hiệp và Uyên",
};

export default function HomePage() {
  return (
    <main className="relative flex h-screen flex-col items-center justify-center gap-4 overflow-hidden px-4 py-6">
      <Book faces={[]} />
      <form action={logout} className="absolute right-4 bottom-4">
        <button type="submit">Đăng xuất</button>
      </form>
    </main>
  );
}
```

Khi sổ có dữ liệu thật, page chỉ thêm một bước đọc:

```tsx
import { getBookFaces } from "@/features/book/server";
import { Book } from "@/features/book";

export default async function HomePage() {
  const faces = await getBookFaces();
  return <Book faces={faces} />;
}
```

`getBookFaces` nằm ở `features/book/server.ts`, mở đầu bằng `import "server-only"`, trả `PageFace[]` đã validate bằng resource.

## 3. Chia `_components` / `_hooks` / `_lib`

Chỉ tách khi route có phần riêng chưa thuộc feature. Ví dụ route soạn sổ:

```text
app/editor/
├── page.tsx                  # server: đọc dữ liệu, render PageEditor
├── _components/
│   ├── PageEditor.tsx        # client: kéo thả item
│   └── ItemToolbar.tsx
├── _hooks/
│   └── useItemDrag.ts
└── _lib/
    └── snap-to-grid.ts
```

| Thư mục | Nội dung | Export |
|---|---|---|
| `_components` | component chỉ route này dùng | một default, tên file PascalCase |
| `_hooks` | hook chỉ route này dùng | một default, `useXxx.ts` |
| `_lib` | hàm thuần chỉ route này dùng | named, kebab-case |

Gạch dưới ở đầu tên thư mục là quy ước của Next: thư mục `_components` không trở thành route. Route con không import từ `_components` của route cha; cần dùng chung thì đưa lên `features/<f>/components`.

## 4. CRUD của cuốn sổ

Ví dụ đầy đủ cho một lần đổi vị trí item, để thấy chia tầng:

**Resource** (`features/book/resources/page-face-item.ts`):

```ts
export const PageFaceItemPositionSchema = v.object({
  x: v.pipe(v.number(), v.minValue(0), v.maxValue(100)),
  y: v.pipe(v.number(), v.minValue(0), v.maxValue(100)),
  rotation: v.number(),
  scale: v.number(),
  z: v.number(),
});
```

**Đọc** (`features/book/server.ts`):

```ts
import "server-only";

export async function getBookFaces(): Promise<PageFace[]> {
  const rows = await db.select().from(pageFaces).orderBy(pageFaces.index);
  return rows.map((row) => v.parse(PageFaceSchema, row));
}
```

**Ghi** (`features/book/actions.ts`):

```ts
"use server";

export async function movePageItem(formData: FormData): Promise<BookActionState> {
  const session = await getSession();
  if (!session) return { error: "Hết phiên đăng nhập." };

  const result = v.safeParse(MovePageItemSchema, Object.fromEntries(formData));
  if (!result.success) {
    return { fieldErrors: v.flatten(result.issues).nested ?? {} };
  }

  await db.update(pageFaceItems).set({ position: result.output.position }).where(...);
  revalidatePath("/");
  return {};
}
```

**Page**: đọc bằng `getBookFaces`, truyền xuống `_components/PageEditor`.

**Client**: `useActionState(movePageItem, null)` và gửi `FormData` từ form hoặc từ `startTransition`.

## 5. Route handler

Chỉ dùng khi cần endpoint HTTP thật. Trong repo, `/api/music/search` và `/api/music/[...path]` là ví dụ: client cần gọi Deezer nhưng không được mang axios và không được lộ request trực tiếp.

Route handler vẫn mỏng:

```ts
export async function GET(request: NextRequest) {
  const query = new URL(request.url).searchParams.get("q");
  if (!query) return NextResponse.json({ data: [] });
  return NextResponse.json({ data: await searchDeezer(query) });
}
```

`searchDeezer` nằm ở `features/music/server.ts`. Route không chứa logic.

## 6. Checklist

- [ ] Page không chứa query DB, không chứa `fetch` nội bộ.
- [ ] Page không có `"use client"` nếu không thật sự cần.
- [ ] Component tương tác là file riêng trong `_components` hoặc `components` của feature.
- [ ] `_hooks` và `_components` của route không bị route khác import.
- [ ] Action trả state có `error` và `fieldErrors`, và gọi `revalidatePath`.
- [ ] Dữ liệu qua biên đều được parse bằng resource schema.
