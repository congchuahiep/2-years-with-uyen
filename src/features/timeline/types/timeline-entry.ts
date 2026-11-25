/**
 * Một mục dữ liệu muốn đặt lên timeline.
 * `date` được dùng để tự chèn mốc năm, `data` là thứ nơi dùng tự render.
 */
export interface TimelineEntry<T> {
  id: string;
  date: string;
  data: T;
}
