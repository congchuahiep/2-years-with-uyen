import type {
  BookData,
  BookPairFlipPage,
  FlipSide,
  FlipTab,
  PageItem,
  PageItemPosition,
  PageItemType,
  PairFlipPage,
  StickyNote,
} from "@/features/book/types";
import { DEFAULT_PAGE_ITEM_POSITION } from "@/features/book/types";
import type { RichMoment } from "@/types/moment";
import { createClient } from "@/utils/supabase/client";

/**
 * Lấy toàn bộ cuốn sổ: các cặp trang, mọi item đã resolve dữ liệu thật
 * (moment / stickyNote) và danh sách flip tab.
 */
export async function fetchBook(): Promise<BookData> {
  const supabase = createClient();

  const [pages, tabs] = await Promise.all([fetchPagesOnly(), fetchFlipTabs()]);

  if (pages.length === 0) return { pages: [], tabs };

  const { data: rawItems, error: itemsError } = await supabase
    .from("page_items")
    .select("*")
    .in(
      "pair_page_id",
      pages.map((page) => page.id),
    )
    .order("side", { ascending: true })
    .order("created_at", { ascending: true });

  if (itemsError) {
    console.error("Lỗi tải page_items:", itemsError);
    throw new Error("Không thể tải nội dung các trang. Vui lòng thử lại sau.");
  }

  const pageItems = (rawItems ?? []) as PageItem[];

  // Gom id theo loại rồi fetch dữ liệu thật theo batch
  const momentIds = [
    ...new Set(
      pageItems
        .filter((item) => item.item_type === "moment")
        .map((item) => item.item_id),
    ),
  ];
  const stickyNoteIds = [
    ...new Set(
      pageItems
        .filter((item) => item.item_type === "sticky_note")
        .map((item) => item.item_id),
    ),
  ];

  const [moments, stickyNotes] = await Promise.all([
    fetchMomentsByIds(momentIds),
    fetchStickyNotesByIds(stickyNoteIds),
  ]);

  const momentMap = new Map(moments.map((moment) => [moment.id, moment]));
  const stickyMap = new Map(stickyNotes.map((note) => [note.id, note]));

  const bookPages: BookPairFlipPage[] = pages.map((page) => ({
    ...page,
    items: pageItems
      .filter((item) => item.pair_page_id === page.id)
      .map((item) => ({
        ...item,
        moment:
          item.item_type === "moment"
            ? (momentMap.get(item.item_id) ?? null)
            : null,
        stickyNote:
          item.item_type === "sticky_note"
            ? (stickyMap.get(item.item_id) ?? null)
            : null,
      })),
  }));

  return { pages: bookPages, tabs };
}

/** Danh sách cặp trang, xếp theo page_order */
async function fetchPagesOnly(): Promise<PairFlipPage[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pair_flip_pages")
    .select("id, page_order")
    .order("page_order", { ascending: true });

  if (error) {
    console.error("Lỗi tải các cặp trang:", error);
    throw new Error("Không thể tải cuốn sổ. Vui lòng thử lại sau.");
  }
  return (data ?? []) as PairFlipPage[];
}

async function fetchFlipTabs(): Promise<FlipTab[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("flip_tabs")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Lỗi tải flip tabs:", error);
    throw new Error("Không thể tải mục lục. Vui lòng thử lại sau.");
  }
  return (data ?? []) as FlipTab[];
}

async function fetchMomentsByIds(ids: string[]): Promise<RichMoment[]> {
  if (ids.length === 0) return [];

  const supabase = createClient();

  // PostgREST giới hạn query IN tối đa 100 phần tử — chia nhỏ nếu cần
  const batchSize = 100;
  const moments: RichMoment[] = [];
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from("moments")
      .select("*, profiles (first_name, last_name, avatar_url)")
      .in("id", batch);

    if (error) {
      console.error("Lỗi tải moments:", error);
      throw new Error(
        "Không thể tải nội dung khoảnh khắc. Vui lòng thử lại sau.",
      );
    }
    moments.push(...(data ?? []));
  }
  return moments;
}

async function fetchStickyNotesByIds(ids: string[]): Promise<StickyNote[]> {
  if (ids.length === 0) return [];

  const supabase = createClient();

  const { data, error } = await supabase
    .from("sticky_notes")
    .select("*")
    .in("id", ids);

  if (error) {
    console.error("Lỗi tải sticky notes:", error);
    throw new Error("Không thể tải ghi chú. Vui lòng thử lại sau.");
  }
  return (data ?? []) as StickyNote[];
}
