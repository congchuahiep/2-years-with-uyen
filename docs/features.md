# Tính năng hiện có

## Xác thực

- Đăng nhập bằng email/mật khẩu, kiểm tra với bảng `users` trong SQLite.
- Mật khẩu hash bằng scrypt; session là cookie JWT `httpOnly` 30 ngày.
- `proxy.ts` chặn mọi route trừ `/login` và `/maintenance` nếu chưa có session.
- Đăng xuất bằng form ở góc phải trang chủ.

## Cuốn sổ

- Route `/` render cuốn sổ lật với bìa trước, 5 trang intro, trang kết và bìa sau.
- Lật bằng kéo chuột/góc trang hoặc nút ◀ ▶; có âm thanh lật trang.
- Responsive: dưới 1024px hiển thị một trang, trên hiển thị hai trang.
- Hiện là **read-only**; chưa có trang động vì editor và mô hình nội dung đang được thiết kế lại.

## Feature giữ lại

### Timeline

`features/timeline` giữ phần toán học và hiển thị của timeline cuộn, nhưng không biết `Moment` là gì: nhận `TimelineNode<T>[]` và hàm `renderItem`/`renderYear` do nơi dùng truyền vào. Chưa được route tới.

### Music

`features/music` gồm ô tìm kiếm Deezer, types và proxy phía server. Route handler trong `app/api/music` chỉ là vỏ mỏng. Chưa được route tới.

## Bảo trì

Bật `MAINTENANCE_MODE=true` để chuyển mọi request sang `/maintenance`.
