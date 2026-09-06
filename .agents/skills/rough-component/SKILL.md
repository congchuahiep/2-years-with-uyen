---
name: rough-component
description: Tạo component vẽ tay (hand-drawn / Doodle) bằng Rough.js cho dự án "2 Years with Uyen". Dùng khi cần tạo khung viền ngoằn ngoèo, nút bấm 3D, thẻ tag xỏ dây, icon nét chì hay bất kỳ hình vẽ nào theo đúng chuẩn thiết kế của repo này.
---

# Rough.js Component (Doodle)

## Khi nào dùng skill này

Dùng khi bạn cần tạo **bất kỳ component nào có nét vẽ tay** bằng Rough.js: khung bao quanh nội dung, nút bấm, icon doodle, thẻ tag, khung ảnh polaroid... Các component này đều nằm dưới `src/components/` (container) hoặc `src/components/icon/` (icon).

## Đọc trước (canonical references)

Trước khi viết component mới, hãy đọc các file chuẩn sau để bắt chước đúng pattern:

- `src/components/ui/rough-box.tsx` — container khung viền (pattern cơ bản nhất).
- `src/components/ui/button.tsx` — nút 3D 2 lớp SVG (complex nhất, tham khảo khi cần hiệu ứng nhấn/vẽ lại).
- `src/components/ui/rough-tag.tsx` — thẻ tag có lỗ xỏ dây (compound path).
- `src/components/icon/key.tsx` hoặc `src/components/icon/heart.tsx` — icon viewBox cố định.
- `src/components/icon/turntable-icon.tsx` — icon phức hợp nhiều lớp SVG + animation.
- `src/types/rough.ts` — kiểu `FillStyle` (dự án tự khai báo lại vì roughjs không export kiểu này).
- `src/utils/cn.ts` — hàm `cn()` (clsx + tailwind-merge) để ghép className.

## Bước 0: Chọn đúng primitive

Quyết định trước khi viết, đừng tự bịa cấu trúc mới:

| Nhu cầu | Dùng |
|---|---|
| Khung viền bao quanh children / văn bản | `RoughBox` có sẵn (`src/components/ui/rough-box.tsx`) — extend nó hoặc dùng trực tiếp |
| Nút bấm tương tác | `Button` có sẵn (`src/components/ui/button.tsx`) |
| Thẻ có lỗ đục xỏ dây | `RoughTag` có sẵn |
| Icon đơn sắc, scale được bằng className | Component raw trong `src/components/icon/` (viewBox cố định) |
| Hình phức hợp nhiều lớp / cần animate từng lớp | Component tùy chỉnh nhiều `<svg>` (xem `turntable-icon.tsx`) |

**Ưu tiên dùng component có sẵn trước**, chỉ tạo mới khi thực sự cần hình dạng chưa có.

## Contract chung (bắt buộc)

Mọi component đều nhận prop:

```ts
roughConfig?: Options & { fillStyle?: FillStyle };
```

- `Options` import từ `roughjs/bin/core`, `FillStyle` từ `@/types/rough`.
- **Màu luôn dùng CSS variables** hoặc `currentColor`, không hardcode hex:
  - `stroke: "currentColor"` cho icon → màu theo class text của Tailwind.
  - `fill: "var(--color-amber-100)"` cho container → theo theme trong `src/styles/globals.css` (`--purple`, `--green`, `--yellow`, `--sky`, `--red`, `--background`, `--foreground`, `--border`, ...).

## 9 pattern bắt buộc

Khi tạo component Rough.js mới, phải tuân thủ tất cả các pattern sau (có sẵn template trong `templates/`):

1. **`"use client"`** ở dòng đầu — vì dùng `useEffect` + thao tác DOM imperative.
2. **Đo kích thước bằng `ResizeObserver`** nếu hình vẽ cần khớp với container (`offsetWidth`/`offsetHeight`, cập nhật vào state `size`). Ngược lại, nếu là icon thì **không đo** — dùng `viewBox` cố định và scale bằng className.
3. **`const configStr = JSON.stringify(roughConfig)`** — stringify ra ngoài, dùng `configStr` trong dependency array của effect, rồi `JSON.parse(configStr)` bên trong. **Tuyệt đối không** để object `roughConfig` vào dependency array (gây re-render vô ích).
4. **Default + spread override**: `const options: Options = { roughness: 1.5, strokeWidth: 2, fillStyle: "solid", ...parsedConfig }`. Icon thường default `roughness: 0.5, strokeWidth: 1, stroke: "currentColor"`.
5. **Xóa node cũ trước khi vẽ lại**: `while (svgRef.current.firstChild) svgRef.current.removeChild(svgRef.current.firstChild);` — Rough.js vẽ imperative và mỗi lần vẽ nét lại random, phải xóa sạch để tránh chồng nét.
6. **Fade-in chống flash**: `const [isDrawn, setIsDrawn] = useState(false)`; sau khi vẽ xong gọi `requestAnimationFrame(() => setIsDrawn(true))`; trên SVG/root dùng `cn(!isDrawn ? "opacity-0" : "opacity-100", "transition-opacity duration-300")`.
7. **SVG nền đặt `pointer-events-none -z-10 overflow-visible`** (hoặc `z-0` nếu cần tầng) — nét rough luôn tràn ra ngoài hình học nên không được cắt. Với container thì **vẽ inset âm**: `rc.rectangle(2, 2, w - 4, h - 4)` để bù phần tràn.
8. **Màu CSS variables** (xem Contract chung).
9. **Phân tầng SVG** khi cần hiệu ứng: nền/bóng đổ 1 tầng, mặt chính 1 tầng (dịch chuyển khi nhấn/xoay), chi tiết 1 tầng — xem `Button` (2 tầng) và `Turntable` (3 tầng, đĩa xoay bằng `motion.svg`).

## Vòng đời vẽ (giải thích cơ chế)

1. Component mount → `ResizeObserver` đo size → state `size` cập nhật.
2. Effect vẽ chạy: đọc `size`, xóa nét cũ, `rough.svg(svgRef.current)` → vẽ shape/path → `appendChild`.
3. `isDrawn` chuyển `true` → effect chạy lại **1 lần nữa** (vì `isDrawn` trong deps) → vẽ đè lần 2 rồi dừng. Đây là hành vi bình thường (double-draw), không phải bug — đừng "sửa" nó.
4. Bất kỳ thay đổi nào về kích thước (resize), config, shape đều kích hoạt vẽ lại toàn bộ.

## Hiệu năng

- Rough.js **random hóa nét mỗi lần vẽ** → mỗi lần vẽ lại là một hình mới. Kiểm soát chặt dependency array để không vẽ lại khi không cần.
- Pattern `configStr` là tối quan trọng để tránh vẽ lại vô ích khi parent re-render.
- Rất nhiều component nhỏ trong một trang có thể gây lag — tránh vẽ lại không cần thiết khi scroll/hover.

## Template

Dùng 2 template trong thư mục này làm điểm khởi đầu:

- `templates/container.tsx` — cho container khung viền (bản sao rút gọn của `RoughBox`).
- `templates/icon.tsx` — cho icon viewBox cố định.

Mỗi template đã có sẵn đủ 9 pattern. Việc cần làm: đổi tên component, chỉnh shape/path trong `useEffect`, thêm props riêng.

## Checklist hoàn thiện

- [ ] `"use client"` ở đầu file.
- [ ] Prop `roughConfig` theo đúng contract (`Options & { fillStyle?: FillStyle }` cho container / `Options` cho icon).
- [ ] `configStr = JSON.stringify(roughConfig)` + parse trong effect.
- [ ] Xóa node cũ trước khi vẽ lại.
- [ ] Fade-in `isDrawn` đúng pattern.
- [ ] SVG có `overflow-visible` (+ `pointer-events-none` nếu là nền trang trí).
- [ ] Màu qua CSS variables / `currentColor`.
- [ ] Đặt đúng chỗ: container → `src/components/ui/` hoặc `src/components/`; icon → `src/components/icon/`.
- [ ] Import `cn` từ `@/utils/cn`, kiểu `FillStyle` từ `@/types/rough`.
- [ ] Đã chạy `bun run lint` hoặc kiểm tra diagnostics cho file mới.