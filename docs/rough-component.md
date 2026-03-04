Dự án có sử dụng Rough.js để tạo các components có style trông như đang vẽ bằng bút chì, hand-made. Bạn có thể tham khảo một số component như `rough-box.tsx`,` button.tsx` hoặc các component trong thư mục `components/icon/` để tham khảo cách triển khai, ở đó có một số lưu ý sau:

- Các component đễ dễ dàng chỉnh màu và style nét vẽ, nó nên nhận một props là `roughConfig` để tùy chỉnh. Tuy nhiên để sử dụng nó trong component, bạn nên stringify `roughConfig` trước khi sử dụng trong `useEffect` điều này để tránh re-render không cần thiết _(do cơ chế gì đó mà mình không rõ nữa)_.
