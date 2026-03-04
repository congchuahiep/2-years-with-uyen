# Các Tính Năng Hoàn Thiện (Features)

Khu vực này để mô tả tóm tắt và liệt kê chi tiết của tất cả các tình huống chức năng đã ổn định mà dự án "2 Years with Uyen" được trang bị từ hệ thống Front-End đến Backend Database.

## Hệ thống Bảo mật chung (Authentication)
Đặc thù của dự án dành cho cá nhân và đặc trưng, không hoạt động như một Mạng Xã Hội mở.
- **Mật Khẩu Chung (Passcode):** Đăng nhập ứng dụng bằng việc Nhập đúng 1 loại Mật Mã Tình Yêu đã được định trước thay vì Tạo tài khoản email.

## 1. Tạo và Chỉnh sửa Kỉ Niệm (Moments)
Tính năng Cốt lõi lưu giữ câu chuyện thông qua Việc viết Nhật Ký (Journaling). Chức năng Create Moments là Trọng Tâm ứng dụng.

- **Nhật Ký Kể Chuyện (Textarea Story):** Cho phép điền thông tin "Tên Kỉ Niệm" (Title), "Kể cho nhau nghe" (Content) cũng như việc mở bót "Thời gian xảy ra". Và tất nhiên lựa chọn cấp độ Công khai của Moment đó.
- **Hoạt họa trang thủ công:** Yếu tố Form đặc trưng là việc bố trí Tờ giấy (Binder Paper) có lỗ thể hiện như mặt giấy của loại sổ tay còng hoặc cuốn Vở thể hiện cho Tình cảm.

## 2. Bảng Polaroid Ghép Ảnh (Polaroid Interactive Board)
Phụ tá vào việc tạo Nhật ký là khả năng lưu giữ Memory qua các thể loại bức Ảnh kỉ niệm (Images). Tuy nhiên nó xây dựng dựa trên kiến trúc ghép Ảnh linh hoạt như ảnh chụp lấy liền (Polaroid). Đồng bộ mạng lưới tọa độ trực tiếp lên Supabase thay vì upload 1 list Hình vô hồn.

- **Kéo và Thả (Drag and Drop):** Người dùng được quyền sắp xếp vị trí từng tấm ảnh trên mặt bàn (Tọa độ X, và Tọa Độ Y). Hoàn toàn nằm trong biên của Bảng Ghim. Tránh hiện tượng ảnh rơi ra ngoài diềm.
- **Thay đổi Tỷ lệ (Aspect Ratio):** Chuyển hướng bức ảnh hình Vuông qua hình Chữ nhật (trục LandScape và trục Portrait). Thông qua 1 thao tác bấm bằng Thanh công cụ thể loại icon Doodle.
- **Xoay thể chiếu (Rotate & Scale):** Kiểm soát và phóng to bức ảnh nếu thấy cần thiết. Tất cả hướng điều khiển sẽ tạo ra các thông số JSON vào metadata riêng.
- **Thiết lập Ảnh Bìa (Main Cover Photo):** Gắn dấu Sao (Star) thể hiện Hình ảnh Đại Diện tạo điểm nhấn thể hiện khi load thành Menu Timeline.

Đây là các tiến độ được thể hiện tính năng. Bất kỳ sự Update/Upgrade Tính năng nào cũng cần tài liệu này cập nhật nhanh nhất để Đảm Bảo Box-Chat tiếp thể hiện đồng bộ tương lai cho Dự Án 2 Years with Uyen.
