/**
 * Giá trị mà `ModalProvider` cung cấp cho cây component con.
 */
export interface ModalContextValue {
  /** Đăng ký một modal vừa mở, dùng để thu nhỏ nền. */
  registerModal: () => void;
  /** Gỡ đăng ký khi modal đóng. */
  unregisterModal: () => void;
  /** True khi còn ít nhất một modal đang mở. */
  isAnyModalOpen: boolean;
  /** Phần tử cuộn của app, để modal khóa cuộn đúng chỗ. */
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}
