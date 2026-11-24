Dự án có sử dụng Rough.js để tạo các components có style trông như đang vẽ bằng bút chì, hand-made. Bạn có thể tham khảo một số component như `src/shared/components/rough-box.tsx`,`src/shared/components/button.tsx` hoặc các component trong thư mục `src/shared/icons/` để tham khảo cách triển khai, ở đó có một số lưu ý sau:

> 💡 **Khi cần tạo một component Rough.js mới**, hãy dùng skill `rough-component` tại `.agents/skills/rough-component/SKILL.md` — skill chứa đầy đủ pattern bắt buộc (9 pattern), contract của `roughConfig`, template container/icon và checklist hoàn thiện.

- Các component đễ dễ dàng chỉnh màu và style nét vẽ, nó nên nhận một props là `roughConfig` để tùy chỉnh. Tuy nhiên để sử dụng nó trong component, bạn nên stringify `roughConfig` trước khi sử dụng trong `useEffect` điều này để tránh re-render không cần thiết _(do cơ chế gì đó mà mình không rõ nữa)_, sau đó tại bên trong `useEffect` bạn có thể parse lại `roughConfig` từ string để sử dụng trong `RoughCanvas`.
