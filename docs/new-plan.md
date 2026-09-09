Xin chào, đây sẽ là phần kế hoạch mới cho dự án

# Ý tưởng cũ

### Tổng quan

Trong kế hoạch cũ, dự án thiết kế trang chủ là một trang khá đơn giản [@/app/page.tsx](../src/app/page.tsx). Ban đầu sẽ có một trang lời chào, khi cuộn xuống sẽ bắt đầu lộ diện ra phần nền và sau đó sẽ có 1 đường cong gọi là Timeline, khi người dùng càng cuộn Timeline càng chạy dài ra.

Trên thanh Timeline đó khi kéo đến đến một khúc nhất định sẽ dần dần hiện ra các MomentItem (mỗi Moment sẽ cách nhau một khoảng 35vh), có hiệu ứng animation in và out rất thích mắt. Khi bấm vào MomentItem nó sẽ hiển thị ra trang xem Moment (Moment là một thành phần quan trọng trong dự án, nó giống như một bài đăng Facebook, có thể chửa ảnh, nội dung, nhạc,...)

Tại trang chủ ở góc phải bên dưới có hiển thị các công cụ tool lơ lửng, giúp người dùng truy cập vào các trang như thiết lập tài khoản, tạo Moment,...

### Vấn đề

Hiện tại cách triển khai của dự án trên khá là an toàn, đơn điệu, chưa đủ xuất sắc đối với bản thân mình. Mình cũng có nghĩ tới cách là cho phép người dùng có thể tự trang trí trang chủ, như gắn thêm element vào timeline, tuy nhiên cách triển khai nó sẽ hơi rối rắm. vậy nên mình muốn tìm một làn gió mới để thay đổi

# Ý tưởng mới

### Dẫn nhập

Trong hồi nghĩ lễ 30/4 mình đã suy nghĩ rất nhiều về phương án mới để cải thiện lại dự án, khi đó mình nghĩ rằng vốn ứng dụng này là một Scrapbook mà nhỉ? Sao không làm nó như ScrapBook thật nhỉ? Từ đó mà mình nghĩ ra một ý tưởng mới, thay vì view Moment bằng Timeline, sao lại không sử dụng **flip book**.

### Tổng quan

Thay vì sử dụng Timeline để hiển thị, ta sẽ sử dụng một Flip book. Flip book là một component giống như một cuốn sách thật, người dùng có thể lật trang, có hiệu ứng trang giấy thật, khả năng dùng mouse gesture để lật,... Với spec như sau:

> **Route**: FlipBook nằm ở **route riêng** (đề xuất `/book`). Trang chủ Timeline hiện tại **giữ nguyên** cho tới khi FlipBook ổn định — chưa xoá gì (quyết định D1).

- Bắt đầu từ một trang bìa ngoài cùng, người dùng có thể lật trang tiếp theo bằng thao tác kéo thả để lật, hoặc sử dụng một nút đề điểu khiển lật tiếp
- Người dùng có thể thấy được hai mặt trang cùng một lúc, mặt trái và mặt phải (trừ trang bìa)
- Một mặt trang giấy đó ta sẽ gọi là "FlipPage" (để tránh trùng với khái niệm trang trong Next.js) Với hai mặt trang đó ta sẽ gọi là một cặp trang "PairFlipPage" (trừ trang bìa vì chỉ có 1 mặt trang), ở đây ta quy chuẩn đánh số cho dễ ha _(trang bìa ngoài cùng: 1; cặp trang đầu: 2, 3; cặp trang thứ hai: 4, 5; ... cứ thế tiếp diễn cho đến bìa cuối)_. Người dùng có thể tạo nhiều thực thể cặp trang PairFlipPage tuỳ ý họ. (Dưới database ta sẽ chỉ lưu PairFlipPage, vì thực tế PairFlipPage đã là hai FlipPage rồi, việc phân biệt FlipPage này chỉ để giúp cho việc hiển thị mà thôi)
- Ở mỗi một mặt trang "FlipPage" có layout là một Grid 2x2, tức là 4 ô vuông, với mỗi một ô này cho phép người dùng gắn MomentItem lên được. Nếu như cả hai mặt trang tức là PairFlipPage hết chỗ, thì người dùng có thể tạo một PairFlipPage mới
- Người dùng có thể di chuyển một MomentItem trong một "FlipPage". Và Người dùng cũng có thể hoàn toàn thay đổi vị trí của "MomentItem" sang một "FlipPage" / "PairFlipPage" khác (điều này khác xa so với sử dụng Timeline để hiển thị, vì người dùng có thể đặt MomentItem bất kỳ ở vị trị nào, tuy nhiên điều đó sẽ làm phá hỏng aesthetic timeline của người dùng đây là trade-off)

Các tính năng thêm, chưa cần làm ngay:

- Người dùng có thể tạo FlipTab, nó sẽ mô phỏng index tab của một cuốn sổ thực sự _(Như trong từ điển có mấy cái nhãn A -> Z lồi ra để đánh dấu vị trí nội dung cho dễ nhìn hơn)_, cho phép người dùng đánh dấu cột mốc kỉ niệm ví dụ 2024, 2025, 2026 và khi nhấn vào cái tag đó nó sẽ navigate tới trang đó dễ dàng hơn
- Cho phép gán sticker vào trong một PairFlipPage, sticker này có thể ở bất kỳ vị trí nào trong PairFlipPage mà không làm chiếm dụng layout chứa MomentItem
- Ngoài MomentItem ra thì ta có thể thêm StickyNote vào trong layout chứa MomentItem, Tức rằng layout của PairFlipPage là dạng grid có thể chứa các Item mà Item đó có thể là MomentItem hoặc StickyNote (mai sau có thể mở rộng thêm để add các item khác nữa)

### Kế hoạch

> **🗓️ Tiến độ thực tế (cập nhật 2026-09-06):** Buổi 1 ✅ · Buổi 2 ✅ · Buổi 3 ✅ · Buổi A (Freeform schema+render) ✅ · **Buổi B (Editor freeform v1) ✅** — còn lại: cross-page dragging, sticker catalog mở rộng, Buổi 6, task "bìa sau chứa Moment".

#### ✅ Buổi 1 (HOÀN THÀNH) — Tái cấu trúc Database & Thiết kế Model

> Hiện trạng: 4 bảng + RPC `reorder_pair_flip_pages` + RLS/GRANT đã apply lên **remote** (đã verify bằng `supabase db query --linked`); backfill 4 moment publish → 1 PairFlipPage (4 mặt trái). API `src/services/flipbook.ts` + hooks `use-flipbook.ts` / `use-flipbook-mutations.ts` (TanStack Query).
> Còn lại ở mục 1: ràng buộc `is_cover` cho bìa (chuyển sang Buổi 3).

Mục tiêu: Đảm bảo Supabase sẵn sàng lưu trữ cấu trúc trang sổ mới.

1. Thiết kế Schema mới:
    - Table `pair_flip_pages`: Lưu thứ tự các cặp trang (page_order). ⚠️ ĐÃ BỎ cột `stickers` (migration freeform) — sticker giờ là `page_items.item_type='sticker'` (quyết định F2).
    - ⚠️ Bìa SAU (và mặt trong bìa trước) giờ cũng chứa Moment (quyết định A3) → cần lưu được `page_items` cho các mặt này. Bìa TRƯỚC là trang đứng yên (không chứa Moment) → không cần lưu. Gợi ý: tạo `pair_flip_pages` đặc biệt với `page_order = 0` (bìa trước) và `page_order = S+1` (bìa cuối), đánh dấu bằng cột `is_cover` (chặn thêm/xoá trang qua API nhưng vẫn cho gắn item) — sẽ chốt chi tiết ở Buổi 3.
    - Table `flip_tabs`: Đánh dấu mục lục (pair_page_id, label, color, position).
    - Table `page_items`: Bảng đa hình (Polymorphic) — **FREEFORM** (quyết định F): (pair_page_id, side - left/right, item_type - 'moment' | 'sticky_note' | 'sticker', `item_id`, `position JSONB {x, y (%), rotation, scale, z}`). Ràng buộc `UNIQUE(item_type, item_id)` — mỗi item chỉ ở đúng 1 nơi (F4). (Đã bỏ `grid_index` + UNIQUE slot ở migration freeform).
    - Table `sticky_notes`: Bảng nội dung note để `page_items.item_id` trỏ tới (id, content, color, created_at, ...) — quyết định C2.
2. Migration Data:
    - Viết script (hoặc Edge Function) để tự động chuyển đổi các Moment hiện có ở dạng Timeline sang cấu trúc pair_flip_pages: sắp xếp theo `event_date` tăng dần, đổ lần lượt 4 Moment vào mặt trái, 4 tiếp theo vào mặt phải, lặp lại cho tới hết (quyết định A2). Moment không có ảnh vẫn được đưa vào ô grid bình thường (quyết định A4).
3. Tạo API service để kết nối frontend + supabase

#### ✅ Buổi 2 (HOÀN THÀNH) — Nghiên cứu & Xây dựng Lõi Flip Book Component

> Không dùng engine tự build — dùng thư viện `react-pageflip` (core `page-flip`) theo quyết định E1: hiệu ứng `user_fold` (kéo góc trang bám chuột), bóng đổ động, mobile support.

> Hiện trạng (src/components/book/):
- Cấu trúc child: Bìa trước (hard, đơn lẻ) → [mặt trong bìa trước] → Intro 3 trang (tiêu đề + 2 trang mở đầu) → các cặp (trái, phải) moment → 10 trang trắng dự trữ → trang tin nhắn cuối → [mặt trong bìa sau] → Bìa sau (hard, đơn lẻ). Quy ước số: bìa = -1, gian = 0, intro = (1,2,3), cặp moment đầu = (4,5), ...
- `BookPageScale`: nội dung dàn layout chuẩn 520×650, `transform: scale()` theo ResizeObserver — sổ co/giãn mà không vỡ layout.
- Responsive: viewport < 1024px → 1 trang (portrait, mọi mặt vẽ như trang phải); ≥ 1024px → spread 2 trang. Tự đo container + debounce 150ms, remount `HTMLFlipBook` khi đổi chế độ.
- `GhostBookDepth`: bìa ảo nằm sau sổ (`-z-50`), fade-in khi lật qua bìa → ảo giác "bìa to hơn, viền lộ ra" (giữ nguyên react-pageflip, không patch lib).
- `flipByButton`: workaround bug page-flip 2.0.x — với `disableFlipByClick`, cú `flipPrev` bị nuốt im lặng ở portrait (tạm gỡ guard quanh API call).
- Âm thanh lật trang (`flip`) qua use-sound; cursor grab/grabbing bám theo state `user_fold` / `fold_corner`.
- Bìa trước: `FrontBookCover` trang trí thuần (không moment). Mặt trong bìa + bìa sau: shell `BookCover` tái sử dụng — theo A3 mới sẽ chứa Moment (Buổi 3).

#### ✅ Buổi 3 (PHẦN LỚN HOÀN THÀNH) — Xây dựng Layout Grid 2x2 & Item Renderers

1. FlipPage Component: ✅ Grid 2x2 trên nền giấy `BlankBookPage` (amber-50 + dot grid + bóng gáy); số trang góc dưới qua `BookNumber`.
2. Item Components:
    - MomentGridItem ✅ = Polaroid `size="sm"` + tiêu đề, xoay nhẹ theo hash của title (`hashToIntRange`), hover scale, bọc `<Link>` → `/moments/detail/:id`.
    - StickyNoteItem ⚠️ bản cơ bản đã có (có thể nâng cấp viền răng cưa + font handwriting sau, theo skill `rough-component`).
3. CÒN LẠI (quyết định A3 mới): **Bìa sau + mặt trong bìa trước phải thành grid chứa Moment** → cần schema `is_cover` đánh dấu bìa (chặn thêm/xoá qua API nhưng vẫn cho gắn item) + luồng đọc/write `page_items` cho 2 mặt bìa.

#### ✅ Buổi A (HOÀN THÀNH 2026-09-06) — Schema & Render FREEFORM

Thay grid 2x2 cố định bằng **giấy vẽ tự do**: người dùng đặt item ở bất kỳ vị trí, xoay, phóng thu (quyết định F1–F7).

> Hiện trạng:
> - Migration `20260906130000_flipbook_freeform.sql` + `20260906130100_fix_freeform_positions.sql` ĐÃ APPLY remote (verify: 4 moment dàn 4 góc phần tư, `position` % chuẩn).
> - Types: `PageItemPosition {x,y,rotation,scale,z}`, `resolvePageItemPosition()` fallback default giữa trang; bỏ `Sticker`/`stickers` cũ.
> - Service: `placePageItem`/`movePageItem`/`addStickyNoteToPage` nhận `position?`; mới `fetchUnplacedMoments()` (tray 2); hooks update theo.
> - Render: `BookPage` tự do — item đặt `left/top %` + `translate(-50%,-50%) rotate scale zIndex`; sticker chưa có catalog → tạm ẩn view (làm ở Buổi B).

#### ✅ Buổi B (v1 HOÀN THÀNH 2026-09-06) — Editor Freeform

Mục tiêu: cho phép "vẽ lên trang giấy" — kéo thả item, chỉnh vị trí/kích thước tự do.

> Hiện trạng (src/components/book/editor/):
> - **`book-editor.tsx`**: overlay toàn màn hình (z-100, khoá lật sách — F7); toolbar chọn cặp trang (chips), ＋ Trang trống (chèn sau trang đang chọn — B1), 🗑 Xoá trang trống (B2), ✕ Hoàn tất; canvas 2 mặt (F1) dàn 520×650 scale theo cửa sổ; hint thao tác.
> - **`editor-face.tsx`**: mỗi mặt = `BlankBookPage` + item FREEFORM — motion drag (pattern PolaroidBoard), quy đổi px↔% theo kích thước thiết kế (F5), clamp trong trang; hover toolbar: ▲ lên lớp, +/− scale (F3), ⟲⟳ xoay ±7.5° (F6), × gỡ khỏi trang (un-place).
> - **`editor-trays.tsx`**: 2 tray (F) — Sticker (kéo thả, drop detection theo rect 2 mặt) + Ghi chú (textarea + 5 màu + nút Dán → `addStickyNoteToPage` tại mặt trái) + **Moment chưa gắn** (`fetchUnplacedMoments` → kéo thả lên canvas, tự cập nhật qua invalidation).
> - **`sticker-catalog.tsx`**: 5 sticker doodle (heart, star, daisy, bow, shooting-star) — `page_items.item_id` = sticker id; renderer dùng chung tray/canvas.
> - Nút bật/tắt "✏️ Sửa trang" trên thanh điều khiển `/book`.
>
> ⏳ Còn lại: **Cross-page dragging** (kéo item ra mép → tự lật sang trang kế) — phần khó nhất, để sau; thêm sticker vào catalog; preview giữa chừng khi kéo item giữa "đang gắn" nếu muốn chuyển trang.

#### 🗑️ Buổi 4 cũ — ĐÃ THAY THẾ bởi Buổi B (Editor Freeform) ở trên

- Nội dung cũ (dnd-kit grid cells, swap ô, quản lý trang) đã được gộp & mở rộng thành Editor freeform. Không còn grid để kéo giữa các ô.

#### 🗑️ Buổi 5 cũ — ĐÃ THAY THẾ bởi Buổi B (Editor Freeform) ở trên

- Nội dung cũ (layer sticker trên PairFlipPage, free-float stickers, sticky note creation) đã được gộp: sticker/note/moment cùng nằm trong `page_items` freeform.

#### ⏳ Buổi 6 (CHƯA LÀM) — FlipTab Navigation & Tích hợp Toolbar

Mục tiêu: Hoàn thiện UI/UX và kết nối với các phần khác của hệ thống.

1. Xây dựng FlipTab Component:
    - Render các thẻ nhãn (tab) thò ra ở cạnh phải/trái của cuốn sổ.
    - Logic bấm vào Tab: Cuốn sổ tự động lật (animate lật nhanh nhiều trang) đến đúng PairFlipPage đó.
2. Điểu chỉnh lại tool Thêm Moment:
    - Khi bấm vào nút Thêm Moment, FlipBook lật tới **PairFlipPage cuối cùng** rồi mở Form. Form Moment **giữ nguyên như hiện tại** (route/modal riêng, không nhúng vào sách — quyết định D3).
    - Moment mới sau khi lưu sẽ được thêm vào PairFlipPage cuối (quyết định A1).
    - Điều chỉnh lại UI để khớp

---

## ✅ Danh sách quyết định đã chốt

| # | Câu hỏi | Quyết định |
|---|---|---|
| A1 | Moment mới đặt ở đâu | Thêm vào **PairFlipPage cuối cùng** (đơn giản cho hiện tại) |
| A2 | Migration moments cũ | Sắp theo `event_date` tăng dần: 4 Moment → mặt trái, 4 → mặt phải, lặp lại |
| A3 | Bìa trước/sau | **Bìa TRƯỚC (ngoài cùng) = trang bìa thật sự**: giới thiệu cuốn sổ, đứng yên cô đơn khi sổ đóng — KHÔNG phải trang grid, không chứa Moment. Mọi mặt còn lại (mặt trong bìa trước, các cặp trang, và cả **bìa SAU**) là grid chứa Moment như nhau |
| A4 | Text-only Moment | Hiển thị Polaroid bình thường + tiêu đề giống MomentItem |
| B1 | Chèn trang | Cho phép chèn PairFlipPage trống ở **bất kỳ vị trí nào** (renumber `page_order`) |
| B2 | Xoá trang | Cho phép xoá PairFlipPage trống; **bìa là trang cố định** — không thêm/xoá/sửa/chèn |
| C1 | Sticker bám mặt nào | (b) — sticker JSON có trường `side: 'left'\|'right'`, sticker **xoay theo mặt giấy** khi lật |
| C2 | StickyNote | Bất kỳ user nào cũng tạo được; nhập **text + chọn màu**; cần bảng `sticky_notes` riêng |
| D1 | Trang chủ cũ | **Giữ nguyên**, FlipBook nằm ở route riêng (đề xuất `/book`); xoá khi FlipBook ổn định |
| D2 | Calendar / Drafts | **Bỏ calendar**; vẫn cần tính năng **draft** |
| D3 | Form Moment | **Giữ nguyên như hiện tại** (route/modal riêng), không nhúng vào sách |
| E1 | Engine lật trang | **Dùng thư viện `react-pageflip`** (core `page-flip`) — có sẵn hiệu ứng `user_fold` (góc trang bám theo chuột), bóng đổ động, hỗ trợ mobile. Bỏ hẳn engine tự build (đã thử, cảm giác lật chưa thật) |
| E2 | doodle.css | Không dùng gói doodle.css; nền giấy dùng pattern hiện có (dotgrid + Rough.js) |
| F1 | Canvas sửa | Cả 2 mặt của spread — kéo item giữa mặt trái/phải tự do (dữ liệu vẫn ghi `side`) |
| F2 | Sticker | Gộp vào `page_items` (`item_type='sticker'`), bỏ `pair_flip_pages.stickers` JSON |
| F3 | Kích thước | Scale cả khung bằng CSS `transform: scale` (0.5–1.5) |
| F4 | Ràng buộc | `UNIQUE(item_type, item_id)` — mỗi item chỉ ở đúng 1 nơi (nền tảng tray "chưa gắn") |
| F5 | Toạ độ | Lưu **%** theo mặt trang (responsive) |
| F6 | Xoay | Có, ±7.5°/lần (như PolaroidBoard) |
| F7 | Editor | Overlay trên `/book`, khoá flip khi edit (canvas ngoài HTMLFlipBook) |
