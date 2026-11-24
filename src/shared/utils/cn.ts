/**
 * Nguồn duy nhất để ghép class Tailwind: `cn` của tailwind-variants
 * (clsx + tailwind-merge, trả về string và tự xử lý xung đột utility).
 *
 * Giữ cả default export để các file đang `import cn from "@/shared/utils/cn"`
 * không vỡ trong lúc chuyển dần sang named import từ chính file này.
 */
export { cn as default, cn } from "tailwind-variants";
