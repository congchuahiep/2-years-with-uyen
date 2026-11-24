import {
	type UseMutationOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { FLIPBOOK_QUERY_KEY } from "@/features/book/query-key";
import {
	addStickyNoteToPage,
	createFlipTab,
	deleteFlipTab,
	deletePairFlipPage,
	insertPairFlipPage,
	movePageItem,
	placePageItem,
	removePageItem,
} from "@/features/book/services/flipbook";
import type {
	FlipSide,
	FlipTab,
	PairFlipPage,
	PageItem,
	PageItemPosition,
	PageItemType,
	StickyNote,
} from "@/features/book/types";

/**
 * Bộ mutation hook cho FlipBook — mỗi hook bọc 1 hàm service và tự
 * invalidate key `flipbook` khi xong (thành công hay thất bại) để cuốn sổ
 * luôn được tải lại đồng bộ. Tất cả dùng chung `useQueryClient()`.
 */

/** Invalidate toàn bộ dữ liệu cuốn sổ sau mỗi mutation */
function useInvalidateFlipBook() {
	const queryClient = useQueryClient();
	const invalidate = () =>
		queryClient.invalidateQueries({ queryKey: FLIPBOOK_QUERY_KEY.book });
	return invalidate;
}

// ---------------------------------------------------------------------------
// Trang (PairFlipPage)
// ---------------------------------------------------------------------------

export type CreatePairFlipPageVariables = { afterPageId?: string };

type UseCreatePairFlipPageOptions = Omit<
	UseMutationOptions<PairFlipPage, Error, CreatePairFlipPageVariables>,
	"mutationFn"
>;

/** Tạo cặp trang mới (chèn sau `afterPageId` — bỏ qua để append cuối sách) */
export const useCreatePairFlipPage = (options?: UseCreatePairFlipPageOptions) => {
	const invalidateFlipBook = useInvalidateFlipBook();

	return useMutation({
		...options,
		mutationFn: ({ afterPageId }) => insertPairFlipPage(afterPageId),
		onSettled: (...params) => {
			invalidateFlipBook();
			options?.onSettled?.(...params);
		},
	});
};

type UseDeletePairFlipPageOptions = Omit<
	UseMutationOptions<void, Error, string>,
	"mutationFn"
>;

/** Xoá cặp trang (chỉ xoá được trang trống) */
export const useDeletePairFlipPage = (options?: UseDeletePairFlipPageOptions) => {
	const invalidateFlipBook = useInvalidateFlipBook();

	return useMutation({
		...options,
		mutationFn: (pageId) => deletePairFlipPage(pageId),
		onSettled: (...params) => {
			invalidateFlipBook();
			options?.onSettled?.(...params);
		},
	});
};

// ---------------------------------------------------------------------------
// Item (page_items)
// ---------------------------------------------------------------------------

export type PlacePageItemVariables = {
	pairPageId: string;
	side: FlipSide;
	itemType: PageItemType;
	itemId: string;
	/** Vị trí tự do (% của mặt trang) — bỏ qua nếu để mặc định giữa trang */
	position?: Partial<PageItemPosition>;
};

type UsePlacePageItemOptions = Omit<
	UseMutationOptions<PageItem, Error, PlacePageItemVariables>,
	"mutationFn"
>;

/** Đặt một item (moment/sticky_note/sticker) lên một mặt trang ở vị trí tự do */
export const usePlacePageItem = (options?: UsePlacePageItemOptions) => {
	const invalidateFlipBook = useInvalidateFlipBook();

	return useMutation({
		...options,
		mutationFn: (variables) => placePageItem(variables),
		onSettled: (...params) => {
			invalidateFlipBook();
			options?.onSettled?.(...params);
		},
	});
};

export type MovePageItemVariables = {
	itemId: string;
	pairPageId: string;
	side: FlipSide;
	position: PageItemPosition;
};

type UseMovePageItemOptions = Omit<
	UseMutationOptions<PageItem, Error, MovePageItemVariables>,
	"mutationFn"
>;

/** Di chuyển một item tới vị trí/trang khác (freeform) */
export const useMovePageItem = (options?: UseMovePageItemOptions) => {
	const invalidateFlipBook = useInvalidateFlipBook();

	return useMutation({
		...options,
		mutationFn: (variables) => movePageItem(variables),
		onSettled: (...params) => {
			invalidateFlipBook();
			options?.onSettled?.(...params);
		},
	});
};

type UseRemovePageItemOptions = Omit<
	UseMutationOptions<void, Error, string>,
	"mutationFn"
>;

/** Gỡ một item khỏi trang (không xoá bản ghi moment/sticky_note gốc) */
export const useRemovePageItem = (options?: UseRemovePageItemOptions) => {
	const invalidateFlipBook = useInvalidateFlipBook();

	return useMutation({
		...options,
		mutationFn: (itemId) => removePageItem(itemId),
		onSettled: (...params) => {
			invalidateFlipBook();
			options?.onSettled?.(...params);
		},
	});
};

// ---------------------------------------------------------------------------
// StickyNote
// ---------------------------------------------------------------------------

export type AddStickyNoteVariables = {
	content: string;
	color?: string;
	pairPageId: string;
	side: FlipSide;
	position?: Partial<PageItemPosition>;
};

type UseAddStickyNoteOptions = Omit<
	UseMutationOptions<StickyNote, Error, AddStickyNoteVariables>,
	"mutationFn"
>;

/** Tạo StickyNote và gắn ngay vào một mặt trang */
export const useAddStickyNote = (options?: UseAddStickyNoteOptions) => {
	const invalidateFlipBook = useInvalidateFlipBook();

	return useMutation({
		...options,
		mutationFn: (variables) => addStickyNoteToPage(variables),
		onSettled: (...params) => {
			invalidateFlipBook();
			options?.onSettled?.(...params);
		},
	});
};

// ---------------------------------------------------------------------------
// FlipTab
// ---------------------------------------------------------------------------

export type CreateFlipTabVariables = {
	pairPageId: string;
	label: string;
	color?: string;
	position?: "left" | "right";
};

type UseCreateFlipTabOptions = Omit<
	UseMutationOptions<FlipTab, Error, CreateFlipTabVariables>,
	"mutationFn"
>;

/** Tạo nhãn mục lục cho một cặp trang */
export const useCreateFlipTab = (options?: UseCreateFlipTabOptions) => {
	const invalidateFlipBook = useInvalidateFlipBook();

	return useMutation({
		...options,
		mutationFn: (variables) => createFlipTab(variables),
		onSettled: (...params) => {
			invalidateFlipBook();
			options?.onSettled?.(...params);
		},
	});
};

type UseDeleteFlipTabOptions = Omit<
	UseMutationOptions<void, Error, string>,
	"mutationFn"
>;

/** Xoá nhãn mục lục */
export const useDeleteFlipTab = (options?: UseDeleteFlipTabOptions) => {
	const invalidateFlipBook = useInvalidateFlipBook();

	return useMutation({
		...options,
		mutationFn: (tabId) => deleteFlipTab(tabId),
		onSettled: (...params) => {
			invalidateFlipBook();
			options?.onSettled?.(...params);
		},
	});
};