# Cấu trúc và Tổ chức dự án

Để dễ dàng bảo trì và bàn giao vào khâu kiểm thử ứng dụng hoặc tích hợp tính năng cho "2 Years with Uyen", dự án hiện tại tuân theo cấu trúc tiêu chuẩn của Framework Next.js App Router (phiên bản 14+) đi cùng với các cách phân chia components mạch lạc.

## Tổng quan thư mục gốc chứa code (src)
- `src/app/` : Nơi chứa tất cả các tuyến đường (routes) ứng dụng.
  - `page.tsx`: File hiển thị HomePage, thường mở rộng các hiệu ứng login và thể hiện chức năng của việc gọi `Moments`.
  - `moments/create/page.tsx`: Nội dung mang đậm tính quan trọng lưu lại các Memory yêu thương. Nơi chủ yếu tạo Form bằng Layout Binding Paper.
  - `moments/create/actions.ts`: Nơi lưu các Server Actions tương tác, truyền dữ liệu kiện trả về db (Supabase).
- `src/components/` : Chứa toàn bộ thể loại hộp thoại (Components) có thể tái sử dụng.
  - `ui/`: Các Components thường dùng cho giao diện để lắp ghép được (ví dụ như Các loại Nút, Switch, Input field, Lỗ hiệu ứng băng keo PolaroidBoard, ...).
  - `icon/`: Thông thường các thể loại icon sẽ đi kèm Component tạo biểu tượng mở ra, đề xuất hoặc điều hướng với Nét vẽ tay (DoorOutIcon).
- `src/hooks/` : Custom React Hooks.
  - `use-safe-back.ts`: Hook giải quyết vấn đề quản lý hành vi nút "Quay lại" an toàn khi tồn tại các action pendings.
  - `use-quest-store.ts` / `use-inventory-store.ts`: Bridge Zustand store vào React (quest + inventory).
  - `use-create-moment.ts`, `use-user-profile.ts`, `use-update-profile.ts`, `use-debounce.ts`, `use-content-pagination.ts`: các hook còn lại.
- `src/stores/`: Zustand stores (`quest-store.ts`, `inventory-store.ts`) dùng `createStore` từ zustand.
- `src/services/`: API service kết nối frontend ↔ Supabase (vd. `flipbook.ts` — thao tác toàn bộ dữ liệu cuốn sổ lật FlipBook).
- `src/providers/`: React providers (`QueryProvider`, `QuestProvider`, `InventoryProvider`, `AudioPreloaderProvider`, `ModalProvider`).
- `src/utils/`: Functions quan trọng trong app nhưng chung (vd. hàm nối class bằng `cn()`, hàm phát Audio khi click, logic tính toán Timeline trong `timeline.ts`).
- `src/utils/supabase/`: Cấu hình client, server và proxy cho Supabase (thay cho `src/lib/` trước đây).

## Các Thư mục lưu trữ mở rộng (Ngoài src)
- `docs/`: Chọn tâm để đặt tất cả hệ thống Tài liệu chi tiết về Dự án (Công Nghệ, Kiểm Thử, Dự Định và Nhiều Thứ Khác) để đồng bộ thật chiều sâu giống như file đang đọc.
- `public/`: Thư mục tài nguyên tĩnh (Assets), nơi chứa hình ảnh gốc tạm hoặc những tệp audio thể hiện Sound Effect chức năng (pop, click, ...).
- `.agents/skills/`: Bộ skill cho agent (vd. `rough-component` — hướng dẫn tạo component vẽ tay bằng Rough.js đúng chuẩn repo).
- `supabase/migrations/`: Các migration SQL (schema + backfill của FlipBook).

Cấu trúc trên cần được duy trì nhất quán, bất kì Component mới nào cũng nên tuân theo định hướng này. Mọi thay đổi lớn tới App Router đều cần cập nhật ngay vào tài liệu này.
