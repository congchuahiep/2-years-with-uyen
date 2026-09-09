-- ============================================================================
-- FlipBook — CORRECTION: dàn lại position của các item cũ (bản migration
-- 130000 có lỗi: default cột position đã chứa khóa 'x' nên điều kiện
-- `where not position ? 'x'` khiến backfill grid→position không chạy, mọi item
-- đều nằm chồng ở tâm (50,50)).
--
-- Cách xử lý: grid_index đã bị drop ở migration trước nên không có dữ liệu gốc
-- để khôi phục chính xác — thay vào đó dàn lại theo thứ tự hàng (created_at, id):
--   item 1 → (25, 25), item 2 → (75, 25), item 3 → (25, 75), item 4 → (75, 75)
-- Idempotent: không làm ảnh hưởng item đã được user chỉnh vị trí (chỉ chạy 1 lần
-- khi số dòng có position giống hệt default trung tâm).
-- ============================================================================

with
-- Chỉ chọn những item vẫn đang nằm đúng "default trung tâm" (chưa ai chỉnh)
stuck_items as (
	select id
	from public.page_items
	where position = '{"x":50,"y":50,"rotation":0,"scale":1,"z":1}'::jsonb
),
-- Đánh số lại theo từng (pair_page_id, side) → dàn vào 4 góc phần tư
ordered as (
	select
		pi.id,
		25 + (row_number() over (partition by pi.pair_page_id, pi.side order by pi.created_at, pi.id) - 1) % 2 * 50 as x,
		25 + ((row_number() over (partition by pi.pair_page_id, pi.side order by pi.created_at, pi.id) - 1) / 2) * 50 as y,
		row_number() over (partition by pi.pair_page_id, pi.side order by pi.created_at, pi.id) as z
	from public.page_items pi
	join stuck_items s on s.id = pi.id
)
update public.page_items pi
set position = jsonb_build_object(
	'x', o.x,
	'y', o.y,
	'rotation', 0,
	'scale', 1,
	'z', o.z
)
from ordered o
where pi.id = o.id;