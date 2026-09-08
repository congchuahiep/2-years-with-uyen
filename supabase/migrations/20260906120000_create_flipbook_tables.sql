-- ============================================================================
-- FlipBook (Scrapbook) — Schema mới cho trang sổ lật
-- Dự án: 2 Years with Uyen
-- Tham chiếu: docs/new-plan.md (Buổi 1 — Tái cấu trúc Database)
--
-- Mô hình:
--   pair_flip_pages  → cặp trang (1 PairFlipPage = 2 FlipPage: trái + phải)
--   page_items       → item (moment | sticky_note) gắn vào ô grid 2x2 của một mặt
--   sticky_notes     → nội dung note (đích của page_items.item_type = 'sticky_note')
--   flip_tabs        → nhãn mục lục (index tab) thò ra mép sách
--
-- Lưu ý thiết kế:
--   - Sticker lưu JSON trên pair_flip_pages; mỗi sticker có trường `side`
--     ('left' | 'right') để gắn theo từng mặt giấy khi lật (quyết định C1).
--     Tọa độ x, y lưu theo PHẦN TRĂM (0-100) của mặt trang để cuốn sổ
--     co giãn responsive mà sticker không bị lệch.
--   - page_items.item_id là khóa ngoại ĐA HÌNH (polymorphic): trỏ tới bảng
--     moments hoặc sticky_notes tùy item_type → KHÔNG thể dùng FK truyền thống.
--     Tính toàn vẹn được đảm bảo ở tầng ứng dụng (API service).
--   - RLS: đây là app cá nhân chỉ có 2 tài khoản cố định (cặp đôi), mọi dòng
--     được chia sẻ giữa 2 người → các policy cho phép authenticated đọc/ghi
--     toàn bộ. (Không dùng auth.role() — dùng mệnh đề TO theo chuẩn mới.)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. pair_flip_pages
-- ---------------------------------------------------------------------------
create table public.pair_flip_pages (
	id uuid not null primary key default gen_random_uuid(),
	page_order integer not null,
	stickers jsonb not null default '[]'::jsonb,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	constraint pair_flip_pages_page_order_key unique (page_order),
	constraint pair_flip_pages_stickers_is_array check (jsonb_typeof(stickers) = 'array')
);

comment on table public.pair_flip_pages is
	'Cặp trang sổ lật: 1 PairFlipPage = 2 FlipPage (mặt trái + mặt phải)';

comment on column public.pair_flip_pages.stickers is
	'Mảng sticker: [{id, type, side: ''left''|''right'', x (%), y (%), rotation (độ), scale, color}]';

-- ---------------------------------------------------------------------------
-- 2. flip_tabs
-- ---------------------------------------------------------------------------
create table public.flip_tabs (
	id uuid not null primary key default gen_random_uuid(),
	pair_page_id uuid not null references public.pair_flip_pages (id) on delete cascade,
	label text not null,
	color text,
	position text not null default 'right',
	created_at timestamptz not null default now(),
	constraint flip_tabs_position_check check (position in ('left', 'right'))
);

comment on table public.flip_tabs is 'Nhãn mục lục (index tab) thò ra mép trái/phải của cuốn sổ';

-- ---------------------------------------------------------------------------
-- 3. sticky_notes
-- ---------------------------------------------------------------------------
create table public.sticky_notes (
	id uuid not null primary key default gen_random_uuid(),
	content text not null,
	color text not null default '#fef3c7',
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

comment on table public.sticky_notes is
	'Nội dung ghi chú dán (đích của page_items khi item_type = ''sticky_note'')';

-- ---------------------------------------------------------------------------
-- 4. page_items
-- ---------------------------------------------------------------------------
create table public.page_items (
	id uuid not null primary key default gen_random_uuid(),
	pair_page_id uuid not null references public.pair_flip_pages (id) on delete cascade,
	side text not null,
	grid_index integer not null,
	item_type text not null,
	item_id uuid not null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	constraint page_items_side_check check (side in ('left', 'right')),
	constraint page_items_grid_index_check check (grid_index between 0 and 3),
	constraint page_items_item_type_check check (item_type in ('moment', 'sticky_note')),
	constraint page_items_slot_unique unique (pair_page_id, side, grid_index)
);

comment on table public.page_items is 'Vị trí các item trên mặt trang (ô grid 2x2 của từng mặt trái/phải)';

-- ---------------------------------------------------------------------------
-- Indexes (phục vụ truy vấn của API service)
-- ---------------------------------------------------------------------------
create index page_items_pair_page_id_idx on public.page_items (pair_page_id);
create index page_items_item_idx on public.page_items (item_type, item_id);
create index flip_tabs_pair_page_id_idx on public.flip_tabs (pair_page_id);

-- ---------------------------------------------------------------------------
-- Trigger cập nhật updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at ()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

create trigger pair_flip_pages_set_updated_at
	before update on public.pair_flip_pages
	for each row execute function public.set_updated_at ();

create trigger page_items_set_updated_at
	before update on public.page_items
	for each row execute function public.set_updated_at ();

create trigger sticky_notes_set_updated_at
	before update on public.sticky_notes
	for each row execute function public.set_updated_at ();

-- ---------------------------------------------------------------------------
-- RPC: sắp xếp lại page_order cho toàn bộ cặp trang
-- (bắt buộc khi chèn/xoá PairFlipPage ở giữa sách — quyết định B1/B2)
-- ---------------------------------------------------------------------------
create or replace function public.reorder_pair_flip_pages (p_ordered_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
	i integer;
begin
	for i in 1 .. array_length(p_ordered_ids, 1) loop
		update public.pair_flip_pages
		set page_order = i
		where id = p_ordered_ids[i];
	end loop;
end;
$$;

comment on function public.reorder_pair_flip_pages (uuid[]) is
	'Gán lại page_order = index+1 theo thứ tự mảng id truyền vào';

-- ---------------------------------------------------------------------------
-- RLS — mô hình truy cập: ứng dụng cá nhân của cặp đôi
-- (chỉ có 2 tài khoản cố định nên mọi dòng được chia sẻ cho authenticated)
-- ---------------------------------------------------------------------------
alter table public.pair_flip_pages enable row level security;
alter table public.flip_tabs enable row level security;
alter table public.sticky_notes enable row level security;
alter table public.page_items enable row level security;

-- pair_flip_pages
create policy "pair_flip_pages_select_for_authenticated" on public.pair_flip_pages
	for select to authenticated using (true);

create policy "pair_flip_pages_insert_for_authenticated" on public.pair_flip_pages
	for insert to authenticated with check (true);

create policy "pair_flip_pages_update_for_authenticated" on public.pair_flip_pages
	for update to authenticated using (true) with check (true);

create policy "pair_flip_pages_delete_for_authenticated" on public.pair_flip_pages
	for delete to authenticated using (true);

-- flip_tabs
create policy "flip_tabs_select_for_authenticated" on public.flip_tabs
	for select to authenticated using (true);

create policy "flip_tabs_insert_for_authenticated" on public.flip_tabs
	for insert to authenticated with check (true);

create policy "flip_tabs_update_for_authenticated" on public.flip_tabs
	for update to authenticated using (true) with check (true);

create policy "flip_tabs_delete_for_authenticated" on public.flip_tabs
	for delete to authenticated using (true);

-- sticky_notes
create policy "sticky_notes_select_for_authenticated" on public.sticky_notes
	for select to authenticated using (true);

create policy "sticky_notes_insert_for_authenticated" on public.sticky_notes
	for insert to authenticated with check (true);

create policy "sticky_notes_update_for_authenticated" on public.sticky_notes
	for update to authenticated using (true) with check (true);

create policy "sticky_notes_delete_for_authenticated" on public.sticky_notes
	for delete to authenticated using (true);

-- page_items
create policy "page_items_select_for_authenticated" on public.page_items
	for select to authenticated using (true);

create policy "page_items_insert_for_authenticated" on public.page_items
	for insert to authenticated with check (true);

create policy "page_items_update_for_authenticated" on public.page_items
	for update to authenticated using (true) with check (true);

create policy "page_items_delete_for_authenticated" on public.page_items
	for delete to authenticated using (true);

-- ---------------------------------------------------------------------------
-- Data API exposure: cấp quyền truy cập bảng/func cho role authenticated
-- (các bảng mới tạo không tự động exposed qua REST API — cần GRANT tường minh)
-- ---------------------------------------------------------------------------
grant usage on schema public to authenticated;

grant select, insert, update, delete on public.pair_flip_pages to authenticated;
grant select, insert, update, delete on public.flip_tabs to authenticated;
grant select, insert, update, delete on public.sticky_notes to authenticated;
grant select, insert, update, delete on public.page_items to authenticated;

grant execute on function public.reorder_pair_flip_pages (uuid[]) to authenticated;