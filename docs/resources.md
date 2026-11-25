# Resource và validate

Valibot là thư viện schema duy nhất của repo: resource, form, env, response API đều dùng nó. Không zod, không validate tay bằng `if`.

## 1. Một resource là gì

Resource là file trong `features/<f>/resources/<kebab>.ts`, mô tả **dữ liệu mà tầng app được thấy**. Thứ tự bắt buộc trong file:

1. Hằng số của resource (nếu có).
2. Schema valibot.
3. Type suy ra từ schema.
4. Hàm thuần của resource (parse, format, nhãn hiển thị).

Ví dụ thật, [user.ts](../src/features/auth/resources/user.ts):

```ts
import * as v from "valibot";

export const UserSchema = v.object({
  id: v.string(),
  email: v.pipe(v.string(), v.email()),
  displayName: v.string(),
  createdAt: v.date(),
});

export type User = v.InferOutput<typeof UserSchema>;
```

Không dùng `namespace`, không có folder `enums/` hay `helpers/` cạnh resource. Enum và hàm riêng của resource nằm ngay trong file đó.

## 2. Biến thể Detail

Khi cần bản đầy đủ hơn bản list, kế thừa bằng `.entries`:

```ts
export const DetailUserSchema = v.object({
  ...UserSchema.entries,
  passwordHash: v.string(),
});

export type DetailUser = v.InferOutput<typeof DetailUserSchema>;
```

Chỉ đặt biến thể Detail ở resource nếu nó thật sự được dùng ở nhiều nơi. Field chỉ một query cần thì khai báo schema cục bộ trong `server.ts` rồi map sang resource, không mở rộng resource cho tiện.

## 3. Resource cho API ngoài

Resource giữ đúng tên field của nguồn để không phải viết mapper. Ví dụ [deezer-track.ts](../src/features/music/resources/deezer-track.ts) giữ snake_case của Deezer:

```ts
export const DeezerTrackSchema = v.object({
  id: v.number(),
  title: v.string(),
  link: v.string(),
  preview: v.string(),
  artist: DeezerArtistSchema,
  album: DeezerAlbumSchema,
});
```

`v.object` bỏ field lạ, nên response API thêm field mới không làm hỏng UI. Field nào có thể thiếu thì khai báo `v.optional`, như `data` của kết quả tìm kiếm:

```ts
export const DeezerSearchResultSchema = v.object({
  data: v.optional(v.array(DeezerTrackSchema), []),
});
```

## 4. Validate ở biên

| Biên | Chỗ validate | Cách làm |
|---|---|---|
| Đọc DB | `features/<f>/server.ts` | `v.parse(XSchema, row)` sau khi bỏ field nhạy cảm |
| Nhận response ngoài | `server.ts` hoặc service của feature | `v.parse(XSchema, response.data)` |
| Nhận `FormData` | `actions.ts` | `v.safeParse(XFormSchema, Object.fromEntries(formData))` |
| Env | `configs/env.ts` | `v.parse(EnvSchema, process.env)` |

Không DTO, không mapper: query trả đúng shape của resource, hoặc map một lần trong `server.ts` rồi parse.

Ví dụ đọc DB, [auth/server.ts](../src/features/auth/server.ts):

```ts
const [row] = await db.select().from(users).where(eq(users.email, email)).limit(1);
if (!row) return null;

return v.parse(UserSchema, {
  id: row.id,
  email: row.email,
  displayName: row.displayName,
  createdAt: row.createdAt,
});
```

`passwordHash` không nằm trong `UserSchema`, nên nó không thể lọt ra UI.

## 5. FormData và form schema

`Object.fromEntries(formData)` là đủ cho form phẳng. Chỉ dùng `formData.getAll(name)` khi field là checkbox nhiều lựa chọn hoặc upload nhiều file.

Form schema đặt ở `features/<f>/forms/<kebab>.ts`, named export:

```ts
export const LoginFormSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.toLowerCase(), v.email()),
  password: v.pipe(v.string(), v.nonEmpty()),
});

export type LoginForm = v.InferOutput<typeof LoginFormSchema>;
```

`v.trim()` và `v.toLowerCase()` biến đổi output, nên `actions.ts` nhận email đã chuẩn hóa, không phải tự `.trim().toLowerCase()`.

## 6. Map lỗi vào `useActionState`

`AuthState` nằm ở `types/auth-state.ts` vì cả action và page cùng dùng:

```ts
export interface AuthState {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}
```

Action trả lỗi field bằng `v.flatten`:

```ts
const result = v.safeParse(LoginFormSchema, Object.fromEntries(formData));

if (!result.success) {
  return {
    fieldErrors: v.flatten(result.issues).nested ?? {},
    error: "Thông tin đăng nhập chưa hợp lệ.",
  };
}
```

Page đọc bằng `useActionState`:

```tsx
const [state, action, pending] = useActionState<AuthState | null, FormData>(login, null);
```

- `state?.error`: lỗi chung, hiển thị trên đầu form.
- `state?.fieldErrors?.email?.[0]`: lỗi cạnh field.
- `pending`: khóa nút submit và hiện spinner.

Valibot trả mảng lỗi cho mỗi field; UI chỉ hiện phần tử đầu tiên để form gọn.

## 7. Checklist

- [ ] Resource nằm trong `resources/`, tên kebab-case, named export.
- [ ] Thứ tự: hằng số, schema, type, hàm.
- [ ] Field nhạy cảm không nằm trong resource dùng cho UI.
- [ ] `server.ts` parse dữ liệu đọc từ DB hoặc API ngoài.
- [ ] `actions.ts` parse `FormData` và trả `AuthState`/`ActionResult` có `fieldErrors`.
- [ ] Không zod, không `namespace`, không DTO, không mapper.
