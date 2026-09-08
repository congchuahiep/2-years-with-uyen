-- ============================================================================
-- FlipBook — Backfill: chuyển đổi các Moment hiện có từ Timeline
-- sang cấu trúc pair_flip_pages (quyết định A2 + A4 trong docs/new-plan.md)
--
-- Quy tắc:
--   - Chỉ chuyển các Moment đã publish (status <> 'draft'); các bản nháp
--     giữ nguyên (tính năng draft vẫn cần — quyết định D2).
--   - Sắp xếp theo event_date tăng dần (rồi đến created_at để ổn định thứ tự).
--   - Mỗi PairFlipPage có 8 ô: 4 ô mặt trái (grid_index 0-3) + 4 ô mặt phải.
--     8 Moment đầu → PairFlipPage đầu tiên, cứ thế tiếp diễn.
--   - Moment không có ảnh vẫn được đưa vào ô grid bình thường.
--
-- CHẠY SAU migration tạo bảng (20260906120000_create_flipbook_tables.sql).
-- Idempotent: lọc theo các moment chưa có trong page_items item_type='moment'.
-- ============================================================================

-- Tránh chạy lại: chỉ lấy các moment chưa được gắn vào page_items
with
published_moments as (
	select m.id, m.event_date, m.created_at
	from public.moments m
	where m.status <> 'draft'
		and not exists (
			select 1
			from public.page_items pi
			where pi.item_type = 'moment'
				and pi.item_id = m.id
		)
),
ordered_moments as (
	select
		pm.id,
		row_number() over (order by pm.event_date asc, pm.created_at asc) - 1 as rn
	from published_moments pm
),
created_pages as (
	insert into public.pair_flip_pages (page_order, stickers)
	select distinct (rn / 8) + 1, '[]'::jsonb
	from ordered_moments
	order by (rn / 8) + 1
	returning id, page_order
)
insert into public.page_items (pair_page_id, side, grid_index, item_type, item_id)
select
	p.id as pair_page_id,
	case
		when (om.rn % 8) < 4 then 'left'
		else 'right'
	end as side,
	(om.rn % 4) as grid_index,
	'moment' as item_type,
	om.id as item_id
from ordered_moments om
join created_pages p on p.page_order = (om.rn / 8) + 1
order by om.rn;