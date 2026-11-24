/**
 * Nguồn duy nhất để ghép class Tailwind: `cn` của tailwind-variants
 * (clsx + tailwind-merge, trả về string và tự xử lý xung đột utility).
 *
 * Giữ cả default export để code cũ `import cn from "@/utils/cn"` không vỡ
 * trong lúc chuyển sang named import từ `@/shared/utils`.
 */
export { cn as default, cn } from "tailwind-variants";
