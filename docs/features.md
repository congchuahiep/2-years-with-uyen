# Tính năng hiện có

Mục lục feature. API và khái niệm riêng của từng feature nằm trong `README.md` của feature đó, không lặp lại ở đây.

## Xác thực

README: [src/features/auth/README.md](../src/features/auth/README.md)

- Đăng nhập bằng email/mật khẩu, kiểm tra với bảng `users` trong SQLite.
- Mật khẩu hash bằng scrypt; session là cookie JWT `httpOnly` 30 ngày.
- `proxy.ts` chặn mọi route trừ `/login` và `/maintenance` nếu chưa có session.
- Đăng xuất bằng form ở góc phải trang chủ.

## Cuốn sổ

README: [src/features/book/README.md](../src/features/book/README.md)

- Route `/` render cuốn sổ lật với bìa trước, 5 trang intro, trang kết và bìa sau.
- Lật bằng kéo chuột/góc trang hoặc nút; có âm thanh lật trang.
- Responsive: dưới 1024px hiển thị một trang, trên hiển thị hai trang.
- Hiện là **read-only**; chưa có trang động vì editor và mô hình nội dung đang được thiết kế lại.

## Timeline

README: [src/features/timeline/README.md](../src/features/timeline/README.md)

- Timeline cuộn generic: nhận `TimelineNode<T>[]` và hàm `renderItem`/`renderYear`, không biết dữ liệu là gì.
- Chưa được route tới.

## Music

README: [src/features/music/README.md](../src/features/music/README.md)

- Ô tìm kiếm Deezer, resource `deezer-track`, proxy server và client `fetch` qua `/api/music/search`.
- Route handler trong `app/api/music` chỉ là vỏ mỏng.
- Chưa được route tới.

## Bảo trì

Bật `MAINTENANCE_MODE=true` để chuyển mọi request sang `/maintenance`.
