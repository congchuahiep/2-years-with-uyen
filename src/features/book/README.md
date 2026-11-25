# Feature book

Cuốn sổ lật: hiển thị các mặt trang theo thứ tự, lật bằng kéo/góc trang hoặc nút, có âm thanh và ghost bìa tạo chiều sâu.

Đọc theo thứ tự: mục 1–6 mô tả mô hình khái niệm bắt buộc cho mọi code trong feature; mục 7 là API công khai. Mục 1–4 là nguồn sự thật, nếu cần thêm khái niệm mới thì cập nhật đây trước rồi hẵng code.

## 1. Ba lớp khái niệm

Một cuốn sách thật có 3 lớp, và ứng dụng mô phỏng đúng 3 lớp đó.

**Trang (page)** là tờ giấy vật lý, có 2 mặt. Khái niệm này gần như không dùng trong code: người dùng không bao giờ xem 2 mặt của cùng một tờ giấy cùng lúc, và page-flip cũng không làm việc theo trang.

**Mặt trang (PageFace)** là đơn vị hiển thị nhỏ nhất. Một tờ giấy có 2 mặt, nên "trang bìa trước" thực chất gồm 2 mặt trang: mặt ngoài và mặt trong. Có hai loại:

- **Mặt trang bìa** (`kind: "cover"`): 4 mặt cố định của sổ, gồm mặt ngoài bìa trước, mặt trong bìa trước, mặt trong bìa sau, mặt ngoài bìa sau. Sổ tự quản, người dùng không thêm/xoá được.
- **Mặt trang giấy** (`kind: "paper"`): phần hiển thị nội dung, có thể là intro, outro hoặc nội dung người dùng thêm vào.

**Cặp mặt trang (PageSpread)** là 2 mặt trang hiện cùng lúc ở chế độ landscape, theo quy tắc `(lẻ, chẵn)`: hai mặt của hai tờ giấy khác nhau. Trong portrait chỉ 1 mặt hiện một lúc, nhưng chỉ số spread vẫn giữ nguyên, nên hai chế độ dùng chung một hệ toạ độ.

## 2. Chỉ số spread (landscape, showCover = true)

Với `k` là tổng số cặp mặt trang và `n` là tổng số mặt trang:

| Spread | Mặt trái | Mặt phải |
|---|---|---|
| 0 | dummy | mặt ngoài bìa trước |
| 1 | mặt trong bìa trước | mặt giấy 1 |
| i | mặt giấy (2i-1) | mặt giấy (2i) |
| k-2 (kề cuối) | mặt giấy n-3 | mặt trong bìa sau |
| k-1 | mặt ngoài bìa sau | dummy |

Chú ý: nếu tổng số mặt chẵn thì spread cuối có thể là `[mặt ngoài bìa sau, dummy]` thay vì bảng trên; code render phải đọc từ dữ liệu face chứ không đoán theo số.

## 3. Mặt dummy

HTMLFlipBook với `showCover = true` đã tự xử lý mặt dummy: mặt trang đầu tiên truyền vào là mặt ngoài bìa trước, nằm bên phải của spread 0, nửa trái để trống sẵn. Vì vậy:

- Dữ liệu nhận vào của `Book` là **chuỗi mặt trang phẳng** (`PageFace[]`), không phải spread.
- Không cần mô hình hoá dummy trong type.
- Ghost bìa (`GhostBookDepth`) là cách app tự vẽ lại nửa trống đó phía sau sổ để tạo chiều sâu; nó không thuộc dữ liệu.

## 4. Mode hiển thị

- **Landscape** (rộng > 1024px): 2 mặt trang cùng lúc, mỗi spread là 1 child của flipbook.
- **Portrait** (rộng <= 1024px): 1 mặt trang một lúc, mọi mặt vẽ như trang phải, mỗi face là 1 child.

Đổi mode sẽ remount flipbook và quay về spread 0.

## 5. Item trên mặt trang giấy

Mỗi mặt trang giấy chứa các `PageFaceItem`, đặt ở vị trí tự do (x, y theo %, rotation, scale, z). Loại item hiện có: `photo`, `sticky_note`, `sticker`. Nội dung item sẽ được nối khi làm editor mới; hiện renderer chưa có gì.

## 6. Ghost bìa

Tờ bìa lót (flyleaf) bị page-flip ẩn trong lúc lật, nên app vẽ `GhostBookDepth` phía sau sổ (`-z-50`) thay thế. Quy tắc hoạt động:

- Ghost **trước** bật khi bìa trước đã mở xong (state `read`), tắt ngay từ cú chạm nửa trái của spread đầu (bắt đầu đóng bìa).
- Ghost **sau** bật khi về gần spread cuối, tắt ngay từ cú chạm nửa phải ở spread cuối (bắt đầu mở bìa sau).
- Không dùng `transition-opacity` cho ghost: fade tạo khoảng hở đúng vào lúc tờ bìa lót biến mất.

## 7. API công khai của feature

Import từ `@/features/book`, hoặc file cụ thể khi đang ở trong feature. Component dùng default export, type và util dùng named export.

| Thành phần | File | Dùng để |
|---|---|---|
| `Book` | `components/Book.tsx` | Component chính, nhận `faces: PageFace[]` |
| `BookPage`, `BlankBookPage`, `BookPageScale` | `components/` | Render từng mặt trang |
| `BookCover` | `components/BookCover.tsx` | Mặt bìa (đứng yên khi sổ đóng) |
| `FrontBookCover`, `IntroBookPages`, `EndBookPage`, `BookNumber` | `components/static-element/` | Trang tĩnh: bìa ngoài, intro, kết |
| `IntroBookPage1`..`IntroBookPage5` | `components/static-element/` | Từng trang intro, mỗi file một trang |
| `buildBookPages`, `LEFT_PAGE_FIRST` | `utils/build-book-pages.tsx` | Dựng child cho HTMLFlipBook từ `PageFace[]` |
| `buildStaticBookPages` | `utils/build-static-book-pages.tsx` | Dựng chuỗi trang tĩnh khi `faces` rỗng |
| `useBookLayout` | `hooks/useBookLayout.ts` | Đo container, tính kích thước và mode |
| `BookLayout` | `types/book-layout.ts` | Kiểu của kết quả đo |
| `INITIAL_LAYOUT`, `PORTRAIT_BREAKPOINT`, `LAYOUT_DEBOUNCE_MS` | `utils/book-layout.ts` | Hằng số layout |
| `BOOK_PAGE_DESIGN_WIDTH`, `BOOK_PAGE_DESIGN_HEIGHT` | `utils/book-page-scale.ts` | Kích thước thiết kế 520x650 |
| `PageFace`, `PageFaceSide`, `PageCoverVariant` | `types/page-face.ts` | Mô hình mặt trang |
| `PageFaceItem`, `PageFaceItemType`, `PageFaceItemPosition` | `types/page-face-item.ts` | Item và vị trí item |
| `BookData` | `types/book-data.ts` | Dữ liệu đầu vào của sổ |
| `resolvePageFaceItemPosition`, `DEFAULT_PAGE_FACE_ITEM_POSITION` | `utils/page-face-item.ts` | Ghép position thiếu trường với default |

Theo convention chung: component và hook là một default export với tên file trùng tên export; type và util là kebab-case với named export. Feature này chưa có `server.ts` hay `actions.ts` vì sổ còn read-only.

### Sổ có hai chế độ dựng trang

- `faces` rỗng: `Book` dùng `buildStaticBookPages`, tức bìa trước, tờ lót (chỉ landscape), 5 trang intro, trang kết, tờ lót sau (chỉ landscape), bìa sau. Đây là trạng thái hiện tại của route `/`.
- `faces` có dữ liệu: `Book` dùng `buildBookPages` và **không** ghép thêm trang tĩnh. Khi nối dữ liệu thật, nơi dùng phải tự dựng đủ chuỗi mặt trang, kể cả 4 mặt bìa.
