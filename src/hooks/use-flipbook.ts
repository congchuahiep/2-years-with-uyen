import { useQuery } from "@tanstack/react-query";
import { FLIPBOOK_QUERY_KEY } from "@/configs/querykey";
import { fetchBook, fetchUnplacedMoments } from "@/services/flipbook";
import type { BookData } from "@/types/flipbook";
import type { RichMoment } from "@/types/moment";

/**
 * Lấy toàn bộ dữ liệu cuốn sổ lật (các cặp trang + items đã resolve + tabs).
 */
export const useFlipBook = () =>
  useQuery<BookData>({
    queryKey: FLIPBOOK_QUERY_KEY.book,
    queryFn: fetchBook,
    refetchOnWindowFocus: false,
  });

/**
 * Danh sách moment ĐÃ PUBLISH nhưng CHƯA gắn vào trang nào (tray 2 của editor).
 * QueryKey nằm dưới prefix ["flipbook"] nên mọi mutation useFlipBook* đều tự
 * invalidate — đồng bộ với sổ.
 */
export const useUnplacedMoments = () =>
  useQuery<RichMoment[]>({
    queryKey: FLIPBOOK_QUERY_KEY.unplacedMoments,
    queryFn: fetchUnplacedMoments,
    refetchOnWindowFocus: false,
    placeholderData: [],
  });
