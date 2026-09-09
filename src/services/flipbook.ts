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
} from "@/types/flipbook";
import { DEFAULT_PAGE_ITEM_POSITION } from "@/types/flipbook";
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

// ============================================================================
// TRANG (PairFlipPage)
// ============================================================================

/**
 * Tạo một cặp trang mới.
 *
 * @param afterPageId Truyền vào để chèn ngay sau cặp trang này (vị trí bất kỳ);
 *                    bỏ qua để append vào cuối sách.
 */
export async function insertPairFlipPage(
  afterPageId?: string,
): Promise<PairFlipPage> {
  const supabase = createClient();

  const pages = await fetchPagesOnly();

  // Tạo tạm ở cuối sách trước để không vỡ ràng buộc UNIQUE(page_order)
  const nextOrder =
    pages.length === 0
      ? 1
      : Math.max(...pages.map((page) => page.page_order)) + 1;

  const { data: newPage, error } = await supabase
    .from("pair_flip_pages")
    .insert({ page_order: nextOrder })
    .select()
    .single();

  if (error || !newPage) {
    console.error("Lỗi tạo cặp trang:", error);
    throw new Error("Không thể tạo trang mới. Vui lòng thử lại sau.");
  }

  // Append cuối sách thì xong, không cần reorder
  if (!afterPageId) return newPage as PairFlipPage;

  const newOrder: string[] = [];
  let found = false;
  for (const page of pages) {
    newOrder.push(page.id);
    if (page.id === afterPageId) {
      newOrder.push(newPage.id);
      found = true;
    }
  }
  // Nếu afterPageId không tồn tại → coi như append cuối
  if (!found) newOrder.push(newPage.id);

  await reorderPairFlipPages(newOrder);
  return newPage as PairFlipPage;
}

/**
 * Xoá một cặp trang. Chỉ cho phép xoá trang TRỐNG (không có item nào).
 * (Bìa là trang cố định nên không bao giờ đi qua hàm này.)
 */
export async function deletePairFlipPage(pageId: string): Promise<void> {
  const supabase = createClient();

  const { count, error: countError } = await supabase
    .from("page_items")
    .select("id", { count: "exact", head: true })
    .eq("pair_page_id", pageId);

  if (countError) {
    console.error("Lỗi kiểm tra trang:", countError);
    throw new Error("Không thể kiểm tra trang. Vui lòng thử lại sau.");
  }
  if ((count ?? 0) > 0) {
    throw new Error(
      "Trang chưa trống — hãy di chuyển hết nội dung đi rồi mới xoá được.",
    );
  }

  const { error } = await supabase
    .from("pair_flip_pages")
    .delete()
    .eq("id", pageId);

  if (error) {
    console.error("Lỗi xoá cặp trang:", error);
    throw new Error("Không thể xoá trang. Vui lòng thử lại sau.");
  }

  // Đánh lại số thứ tự cho các trang còn lại
  const remaining = (await fetchPagesOnly()).map((page) => page.id);
  await reorderPairFlipPages(remaining);
}

/** Gán lại page_order cho toàn bộ cặp trang theo thứ tự mảng id truyền vào */
export async function reorderPairFlipPages(
  orderedIds: string[],
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.rpc("reorder_pair_flip_pages", {
    p_ordered_ids: orderedIds,
  });

  if (error) {
    console.error("Lỗi sắp xếp lại trang:", error);
    throw new Error("Không thể sắp xếp lại các trang. Vui lòng thử lại sau.");
  }
}

/**
 * Đặt một item lên một mặt trang tại vị trí tự do.
 * Ràng buộc UNIQUE(item_type, item_id) — 1 item chỉ đứng 1 nơi (quyết định F4).
 */
export async function placePageItem(params: {
  pairPageId: string;
  side: FlipSide;
  itemType: PageItemType;
  itemId: string;
  position?: Partial<PageItemPosition>;
}): Promise<PageItem> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("page_items")
    .insert({
      pair_page_id: params.pairPageId,
      side: params.side,
      item_type: params.itemType,
      item_id: params.itemId,
      position: { ...DEFAULT_PAGE_ITEM_POSITION, ...params.position },
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Lỗi đặt item vào trang:", error);
    throw new Error(
      error?.code === "23505"
        ? "Nội dung này đã được gắn vào một nơi khác rồi."
        : "Không thể đặt nội dung vào trang. Vui lòng thử lại sau.",
    );
  }
  return data as PageItem;
}

/**
 * Di chuyển một item (đã tồn tại) sang vị trí/mặt trang khác.
 */
export async function movePageItem(params: {
  itemId: string;
  pairPageId: string;
  side: FlipSide;
  position: PageItemPosition;
}): Promise<PageItem> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("page_items")
    .update({
      pair_page_id: params.pairPageId,
      side: params.side,
      position: params.position,
    })
    .eq("id", params.itemId)
    .select()
    .single();

  if (error || !data) {
    console.error("Lỗi di chuyển item:", error);
    throw new Error(
      error?.code === "23505"
        ? "Nội dung này đã được gắn vào một nơi khác rồi."
        : "Không thể di chuyển nội dung. Vui lòng thử lại sau.",
    );
  }
  return data as PageItem;
}

/** Gỡ một item khỏi trang (không xoá bản ghi moment/sticky_note gốc) */
export async function removePageItem(itemId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("page_items").delete().eq("id", itemId);
  if (error) {
    console.error("Lỗi gỡ item khỏi trang:", error);
    throw new Error("Không thể gỡ nội dung khỏi trang. Vui lòng thử lại sau.");
  }
}

/** Tạo một StickyNote mới (chưa gắn vào trang) */
export async function createStickyNote(params: {
  content: string;
  color?: string;
}): Promise<StickyNote> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("sticky_notes")
    .insert({ content: params.content, color: params.color ?? "#fef3c7" })
    .select()
    .single();

  if (error || !data) {
    console.error("Lỗi tạo sticky note:", error);
    throw new Error("Không thể tạo ghi chú. Vui lòng thử lại sau.");
  }
  return data as StickyNote;
}

/**
 * Tạo StickyNote rồi gắn ngay vào một mặt trang — nghiệp vụ 1 lần gọi.
 * (Nếu bước gắn thất bại, note gốc vẫn còn trong DB — app tự quản lý.)
 */
export async function addStickyNoteToPage(params: {
  content: string;
  color?: string;
  pairPageId: string;
  side: FlipSide;
  position?: Partial<PageItemPosition>;
}): Promise<StickyNote> {
  const note = await createStickyNote({
    content: params.content,
    color: params.color,
  });

  await placePageItem({
    pairPageId: params.pairPageId,
    side: params.side,
    itemType: "sticky_note",
    itemId: note.id,
    position: params.position,
  });

  return note;
}

// ============================================================================
// MOMENT CHƯA GẮN (tray 2 của editor freeform)
// ============================================================================

/**
 * Danh sách moment ĐÃ PUBLISH nhưng CHƯA được gắn vào bất kỳ trang nào
 * (không có page_items item_type='moment' trỏ tới) — cho tray "moment chưa gắn".
 */
export async function fetchUnplacedMoments(): Promise<RichMoment[]> {
  const supabase = createClient();

  const [{ data: placed }, { data: moments, error }] = await Promise.all([
    supabase.from("page_items").select("item_id").eq("item_type", "moment"),
    supabase
      .from("moments")
      .select("*, profiles (first_name, last_name, avatar_url)")
      .neq("status", "draft")
      .order("event_date", { ascending: false }),
  ]);

  if (error) {
    console.error("Lỗi tải moments chưa gắn:", error);
    throw new Error(
      "Không thể tải các khoảnh khắc chưa gắn. Vui lòng thử lại sau.",
    );
  }

  const placedIds = new Set((placed ?? []).map((row) => row.item_id as string));
  return (moments ?? []).filter((moment) => !placedIds.has(moment.id));
}

// ============================================================================
// FLIP TAB
// ============================================================================

/** Tạo một nhãn mục lục (FlipTab) cho một cặp trang */
export async function createFlipTab(params: {
  pairPageId: string;
  label: string;
  color?: string;
  position?: "left" | "right";
}): Promise<FlipTab> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("flip_tabs")
    .insert({
      pair_page_id: params.pairPageId,
      label: params.label,
      color: params.color ?? null,
      position: params.position ?? "right",
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Lỗi tạo flip tab:", error);
    throw new Error("Không thể tạo nhãn mục lục. Vui lòng thử lại sau.");
  }
  return data as FlipTab;
}

/** Xoá một nhãn mục lục */
export async function deleteFlipTab(tabId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("flip_tabs").delete().eq("id", tabId);
  if (error) {
    console.error("Lỗi xoá flip tab:", error);
    throw new Error("Không thể xoá nhãn mục lục. Vui lòng thử lại sau.");
  }
}
