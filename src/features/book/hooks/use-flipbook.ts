import { useQuery } from "@tanstack/react-query";
import { FLIPBOOK_QUERY_KEY } from "@/features/book/query-key";
import { fetchBook } from "@/features/book/services/flipbook";
import type { BookData } from "@/features/book/types";

/**
 * Lấy toàn bộ dữ liệu cuốn sổ lật (các cặp trang + items đã resolve + tabs).
 */
export const useFlipBook = () =>
	useQuery<BookData>({
		queryKey: FLIPBOOK_QUERY_KEY.book,
		queryFn: fetchBook,
		refetchOnWindowFocus: false,
	});
