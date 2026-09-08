import { useQuery } from "@tanstack/react-query";
import { FLIPBOOK_QUERY_KEY } from "@/configs/querykey";
import { fetchBook } from "@/services/flipbook";
import type { BookData } from "@/types/flipbook";

/**
 * Lấy toàn bộ dữ liệu cuốn sổ lật (các cặp trang + items đã resolve + tabs).
 */
export const useFlipBook = () =>
	useQuery<BookData>({
		queryKey: FLIPBOOK_QUERY_KEY.book,
		queryFn: fetchBook,
		refetchOnWindowFocus: false,
		// Render ngay với sổ rỗng trong lúc chờ — tránh flicker "undefined"
		placeholderData: { pages: [], tabs: [] },
	});
