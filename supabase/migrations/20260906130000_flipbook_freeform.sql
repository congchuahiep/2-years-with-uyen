-- ============================================================================
-- FlipBook — Buổi A: page_items chuyển từ GRID 2x2 sang FREEFORM
-- (quyết định F1-F7 trong docs/new-plan.md, 2026-09-06)
--
-- Thay đổi:
--   1. `page_items`: bỏ `grid_index`, thêm `position JSONB` {x,y (%), rotation, scale, z}
--   2. `page_items.item_type` mở rộng thêm 'sticker' (gộp sticker vào page_items,
--      thay cho `pair_flip_pages.stickers` JSON — quyết định F2)
--   3. Ràng buộc: bỏ UNIQUE(pair_page_id, side, grid_index) → thay bằng
--      UNIQUE(item_type, item_id) — mỗi item chỉ ở đúng 1 nơi (quyết định F4)
--   4. `pair_flip_pages`: bỏ cột `stickers` (đã migrate hết sang page_items)
--
-- Idempotent: có thể chạy lại an toàn (các bước đều kiểm tra tồn tại).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Thêm cột position
-- ---------------------------------------------------------------------------
alter table public.page_items
	add column if not exists position jsonb not null default '{"x":50,"y":50,"rotation":0,"scale":1,"z":1}'::jsonb;

do $$
begin
	-- Chỉ thêm check (position là object) nếu chưa tồn tại
	if not exists (
		select 1 from pg_constraint where conname = 'page_items_position_is_object'
	) then
		alter table public.page_items
			add constraint page_items_position_is_object check (jsonb_typeof(position) = 'object');
	end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Backfill: map grid_index (0-3) → toạ độ tâm 4 góc phần tư của mặt trang
--    grid 0 (trên-trái) → (25, 25); 1 (trên-phải) → (75, 25); 2 → (25, 75); 3 → (75, 75)
-- ---------------------------------------------------------------------------
update public.page_items
set position = jsonb_build_object(
	'x', 25 + (grid_index % 2) * 50,
	'y', 25 + (grid_index / 2) * 50,
	'rotation', 0,
	'scale', 1,
	'z', grid_index + 1
)
where not position ? 'x';

-- ---------------------------------------------------------------------------
-- 3. Mở rộng item_type cho phép 'sticker' (phải làm TRƯỚC khi insert sticker)
-- ---------------------------------------------------------------------------
alter table public.page_items drop constraint if exists page_items_item_type_check;
alter table public.page_items
	add constraint page_items_item_type_check check (item_type in ('moment', 'sticky_note', 'sticker'));

-- ---------------------------------------------------------------------------
-- 4. Đổi ràng buộc: bỏ UNIQUE(slot) cũ → thêm UNIQUE(item_type, item_id)
--    (làm TRƯỚC bước migrate sticker để ON CONFLICT ở bước 5 hoạt động)
-- ---------------------------------------------------------------------------
alter table public.page_items drop constraint if exists page_items_slot_unique;
alter table public.page_items
	add constraint page_items_item_unique unique (item_type, item_id);

-- ---------------------------------------------------------------------------
-- 5. Migrate stickers cũ (pair_flip_pages.stickers JSON) → page_items
--    Sticker cũ: {id, type, side, x, y, rotation, scale, color}
--    → 1 dòng page_items item_type='sticker', item_id = sticker.id, position từ x/y/...
-- ---------------------------------------------------------------------------
insert into public.page_items (pair_page_id, side, item_type, item_id, position)
select
	p.id as pair_page_id,
	(s ->> 'side')::text as side,
	'sticker' as item_type,
	-- Sticker.id cũ có thể là text không phải uuid → chỉ cast khi hợp lệ, ngược lại sinh mới
	case
		when (s ->> 'id') ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
			then (s ->> 'id')::uuid
		else gen_random_uuid()
	end as item_id,
	jsonb_build_object(
		'x', ((s ->> 'x')::numeric),
		'y', ((s ->> 'y')::numeric),
		'rotation', ((s ->> 'rotation')::numeric),
		'scale', ((s ->> 'scale')::numeric),
		'z', 1
	) as position
from public.pair_flip_pages p
cross join lateral jsonb_array_elements(p.stickers) as s
where jsonb_typeof(p.stickers) = 'array'
on conflict (item_type, item_id) do nothing;

-- ---------------------------------------------------------------------------
-- 6. Dọn bỏ grid_index cùng check constraint đi kèm
-- ---------------------------------------------------------------------------
alter table public.page_items drop constraint if exists page_items_grid_index_check;
alter table public.page_items drop column if exists grid_index;

-- ---------------------------------------------------------------------------
-- 7. Bỏ stickers JSON trên pair_flip_pages (đã migrate ở bước 5)
-- ---------------------------------------------------------------------------
alter table public.pair_flip_pages drop column if exists stickers;