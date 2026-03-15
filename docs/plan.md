# Kế Hoạch Phát Triển Dự án (Project Plan)

Tài liệu này dùng để tóm tắt lại nguyên nhân hình thành và hướng phát triển cho "2 Years with Uyen". Kế hoạch được chia thành nhiều Giai Đoạn để AI và các Nhà Phát Triển kế nhiệm theo dõi.

## Giai Đoạn Hiện Tại (Đang triển khai - MVP)

Mục tiêu của giai đoạn này là ra mắt các chức năng phức tạp để lưu lại Những Cuốn Nhật ký và Khoảnh khắc thể hiện sổ lưu niệm "Scrapbook".

- **Hoàn Thiện Form Tạo Khoảnh Khắc:** Đã chuyển thể và nâng cấp thành công trang tạo niềm nhớ sang giao diện 100% mặt bàn lộn xộn, xé giấy với Component Trang Sổ Còng.
- **Upload và Quản lý Polaroid:** Thiết lập ổn định Bảng Ghim Hình (PolaroidBoard) với tương tác kéo thả mượt mà cùng việc lưu trữ vị trí x,y chuẩn xác vào database.

## Giai Đoạn 2 (Cập Nhật Và Thể Hiện Giao Diện)

Mục tiêu chính trong thời gian tới là đọc Dữ liệu Nhật ký, và Trình bày chi tiết nó bằng Hiệu Ứng Thời gian đặc biệt (Timeline Timeline).

- **Màn Hình Cửa Chính (Feed):** Phải chứa tất cả những nhật ký hoặc Hình ảnh người dùng lưu ở Trang Chủ tạo thành 1 băng chuyền kiểu slide show hoặc hình phát ảnh phẳng từ biệt dạng.
- **Tương tác "Thích và Bình luận":** Tuy nhiên, nó sẽ mang sắc màu cá nhân và hoạt động tĩnh hoàn, tức là chỉ cần 2 người dùng hoàn thành bình luận hoạt hoặc "Thả tim". Thể hiện bởi Animation lưu bút.
- **Tính năng Chỉnh sửa:** Đồng bộ Component View Trang (Page.tsx) của CreateMoment thiết lập việc xem lại hoặc Sửa lại ảnh/chữ nếu có nhu cầu. Quản lí hoàn toàn logic của việc lưu trang nháp (draft).

## Giai Đoạn 3 (Bảo trì và Tăng Cường Trải nghiệm)

Đây là lộ trình lâu dài nhằm ổn định dự án và phục vụ cho việc nhãn quyền sự khuyến học hoặc tăng tốc hệ thống. Nắm bắt lỗi kĩ thuật hình khối không mong đợi (Crash UI).

- Tích hợp hệ thống thông báo (Toast notification) cho các hoạt động của Form bao gồm các lỗi logic, hoặc các thông báo cập nhật lỗi không tồn tại dữ liệu về mặt Validation của React Hook Form.
- Tối ưu tất cả mã vạch hoặc chi tiết Hình ảnh dùng đúng tiêu chuẩn Image của Next.js giảm tình trạng Tải chậm hoặc hiện tượng Lag CSS do roughjs thể hiện. Nhất là trên điện thoại Mobile. Trang Responsive hoàn hảo.

# Công việc

- [ ] Trang home `/`
    - [x] Hiển thị tất cả những khoảnh khắc đã tạo bằng Timeline.
        - [x] Nhấn vào mở trang modal chi tiết khoảnh khắc.
        - [x] Kéo tới đâu, thì timeline sẽ hiển thị những khoảnh khắc tương ứng với thời gian đó, và có hiệu ứng animation xuất hiện khoảng khắc chuyển động mượt mà.
        - [ ] Tích hợp tính năng "Thích và Bình luận" với hiệu ứng lưu bút.
        - [ ] Sửa lại layout cho Timeline để các khoảng khắc đúng vị trí hơn (hiện tại thì những khoảng khắc đầu tiên khi tạo không được nằm bên dưới cùng khi có 1, hay 2 khoảng khắc)
    - [ ] Spotify Widget để hiển thị top danh sách bản nhạc yêu thích của cặp đôi.
- [ ] Trang hiển thị khoảng khắc bằng lịch `/calendar`
    - [ ] Hiển thị tất cả những khoảnh khắc đã tạo bằng lịch.
    - [ ] Nhấn vào mở trang modal chi tiết khoảnh khắc.
- [ ] Trang tạo Moment `/moments/create`
    - [x] Hoàn thiện Form Tạo Khoảnh Khắc (CreateMoment) với giao diện Sổ Còng.
    - [x] Thiết lập Bảng Ghim Hình (PolaroidBoard) với tính năng kéo thả và lưu trữ vị trí.
    - [ ] Tích hợp chọn nhạc spotify vào khoảnh khắc.
- [ ] Trang sửa Moment `/moments/:id/edit`
    - [ ] Đồng bộ Component View Trang (Page.tsx) của CreateMoment để xem lại hoặc Sửa lại ảnh/chữ nếu có nhu cầu. Quản lí hoàn toàn logic của việc lưu trang nháp (draft).
- [ ] Trang danh sách Moment nháp `/moments/drafts`
    - [ ] Hiển thị tất cả những khoảnh khắc đã tạo nhưng chưa được xuất bản (draft).
    - [ ] Nhấn vào mở trang `/moments/create` với dữ liệu đã lưu sẵn để tiếp tục chỉnh sửa.
