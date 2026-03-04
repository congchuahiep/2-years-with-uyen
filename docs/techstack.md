# Khái quát về Công nghệ cốt lõi của dự án

Tài liệu này mô tả chi tiết các công nghệ được sử dụng để phát triển hỗ trợ ứng dụng. Dự án "2 Years with Uyen" tập trung vào kiến trúc ứng dụng web hiện đại, tối ưu hóa cho Hiệu suất (Performance) và Trải nghiệm người dùng độc đáo thông qua hình ảnh thao tác kéo-thả.

## Frameworks và Nền tảng
- **Next.js (App Router)**: Đây là framework cốt lõi của dự án theo kiến trúc React hiện đại (phiên bản mới nhất hỗ trợ App Router). Nó giúp quản lý Routing, Server Actions và tối ưu hóa SEO hoặc rendering các trang từ Server (SSR) để mang lại tốc độ load trang tối đa.
- **React.js**: Thư viện giao diện chính giúp xây dựng các UI Components tương tác mạnh mẽ ở phía Client.

## Ngôn ngữ và Kiểu dữ liệu
- **TypeScript**: Ngôn ngữ chính giúp chuẩn hóa việc khai báo kiểu dữ liệu. Toàn bộ dự án được code bằng TypeScript để tránh lỗi Runtime về sau. Sử dụng các interface và types kết hợp chặt chẽ với Supabase.

## Styling (Cách điểm trang)
- **Tailwind CSS**: Framework CSS tiện ích (utility-first) cung cấp toàn bộ các classes tạo kiểu ngay tại code HTML/JSX của thành phần đó mà không cần đến các tệp `.css` thông thường.
- **CSS Variables**: Tự do thiết lập hệ thống màu sắc qua biến CSS trong file global (từ đặc phái `globals.css`) chủ yếu cho màu sắc "Doodle".
- **Framer Motion**: Sử dụng cho Animations, cụ thể là để xử lý việc di chuyển các bức ảnh trên Bảng Polaroid Board một cách mượt mà (Spring animation drag, drop, rotate).

## Cơ sở dữ liệu (Database và BaaS)
- **Supabase**: Hệ thống lưu trữ phụ trợ hoàn thiện Backend (BaaS) dựa trên nền tảng PostgreSQL hoạt động tốt cùng kiến trúc Next.js.
- **Supabase Storage**: Hệ thống phục vụ upload và trả về đường dẫn ảnh động, hữu dụng trong việc hỗ trợ form trang lưu lại Kỷ Niệm với đặc tả các tấm hình người dùng tải lên.

## Thư viện hỗ trợ Giao diện tay (Sketch)
- **Rough.js**: Chính đây là thư viện cốt lõi mang đến giao diện "Vẽ tay" vào hệ thống các khối HTML như Các tấm Bảng, Nút bấm hoặc Thuyết minh bằng nét vẽ mộc.
- **react-rough-notation**: Thư viện hỗ trợ gạch chân, tạo điểm nhấn đóng vai vai trò phân lưu bản text bằng những nét viết bút đa hướng trên mặt giấy.
