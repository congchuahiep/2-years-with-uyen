# Project Context: Our Diary 💕

Ứng dụng "Our Diary" là một món quà đặc biệt kỷ niệm 2 năm yêu nhau, được thiết kế như một cuốn sổ tay điện tử (handbook) lưu giữ hành trình tình yêu của một cặp đôi.

## 🌟 Mục tiêu dự án
- Tạo không gian riêng tư, bảo mật để lưu giữ hình ảnh và nhật ký hàng ngày.
- Trải nghiệm người dùng mang tính cá nhân hóa cao, gợi cảm xúc mộc mạc và gần gũi.

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router).
- **Backend & Auth**: Supabase (Database, Storage, Authentication).
- **Styling**: Tailwind CSS với cấu hình tùy chỉnh cho phong cách Doodle.
- **Fonts**: 
  - `Pangolin`: Font chữ viết tay chủ đạo.
  - `Fuzzy Bubbles`: Font chữ bổ trợ cho cảm giác ngộ nghĩnh.
  - (Cả hai được load bằng `next/font/google` với subset tiếng Việt trong `src/configs/font.ts`.)

## 🎨 Phong cách nghệ thuật (Art Style)
- **Concept**: Notebook / Doodle / Hand-drawn (Sổ tay vẽ tay).
- **Đặc điểm**:
  - Nền giấy nháp ngả vàng với lưới chấm (dot grid) màu tím nhạt.
  - Các thành phần UI (nút bấm, ô nhập liệu, khung hình) có viền ngoằn ngoèo, không hoàn hảo như được vẽ bằng tay — nét vẽ sinh ra từ thư viện **Rough.js** (xem `src/components/ui/rough-box.tsx`, `button.tsx` và các component trong `src/components/icon/`).
  - Hiệu ứng đổ bóng cứng (hard shadow) và các góc bo lớn (`rounded-4xl`).

## 🔐 Cơ chế hoạt động & Bảo mật
- **Xác thực**: Chỉ cho phép 2 tài khoản cụ thể (Email/Password) được cấu hình trên Supabase truy cập.
- **Điều hướng**: 
  - Sử dụng `src/proxy.ts` để kiểm tra session và bảo vệ các route.
  - Người dùng chưa đăng nhập sẽ tự động bị chuyển hướng về trang `/login`.
- **Cấu hình**: Biến môi trường được quản lý chặt chẽ thông qua `src/configs/env.ts` sử dụng Zod để đảm bảo tính an toàn dữ liệu.

## 🧩 Cấu trúc thư mục quan trọng
- `src/app/login`: Trang đăng nhập phong cách Doodle.
- `src/styles/globals.css`: Hệ màu Doodle (CSS variables `oklch`) và theme Tailwind.
- `src/components/ui/`: Bộ component vẽ tay dùng chung (RoughBox, Button, RoughTag, Polaroid...). Khi tạo component Rough.js mới, hãy dùng skill `rough-component` (`.agents/skills/rough-component/SKILL.md`).
- `src/utils/supabase`: Chứa các cấu hình client, server và proxy cho Supabase.
- `src/configs/env.ts`: Quản lý biến môi trường tập trung.

# Document
Mọi thông tin thêm của dự án được liệt kê trong thư mục [docs](docs/)
