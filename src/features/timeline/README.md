# Feature timeline

Timeline cuộn dọc, generic theo dữ liệu: feature không biết "moment", "ảnh" hay "kỷ niệm" là gì. Nó nhận danh sách item và hai hàm render do nơi dùng truyền vào. Chưa được route tới.

## Khái niệm

- **TimelinePoint**: toạ độ % trong khung timeline.
- **TimelineEntry\<T\>**: một mục dữ liệu kèm `date`; `date` dùng để tự chèn mốc năm.
- **TimelineNode\<T\>**: entry đã trộn mốc năm, hoặc `{ type: "year" }`, hoặc `{ type: "item" }`.
- **Đường cong**: `BASE_LINE` là mẫu đường uốn, lặp lại mỗi `BASE_LINE_CYCLE_VH`, sinh điểm dày bằng nội suy Catmull-Rom.

## Luồng dữ liệu

```text
entries: TimelineEntry<T>[]
  -> generateTimelineNodes(entries)          utils/timeline-layout.ts
  -> calculateTimelineHeight(nodes)
  -> generateBaseCurve(totalHeightVh)        utils/timeline-curve.ts
  -> generateDenseCurvePoints(points)
  -> calculateItemPositions(nodes, height, curve)
  -> <Timeline nodes={...} itemPositions={...} renderItem={...} />
```

## File và API

| File | Export |
|---|---|
| `components/Timeline.tsx` | default `Timeline` |
| `components/YearIndicatorItem.tsx` | default `YearIndicatorItem` |
| `types/timeline-point.ts` | `TimelinePoint` |
| `types/timeline-entry.ts` | `TimelineEntry` |
| `types/timeline-node.ts` | `TimelineNode` |
| `types/timeline-render-args.ts` | `TimelineRenderItemArgs`, `TimelineRenderYearArgs` |
| `utils/timeline-curve.ts` | `BASE_LINE`, `BASE_LINE_CYCLE_VH`, `getXatY`, `generateDenseCurvePoints`, `generateBaseCurve` |
| `utils/timeline-layout.ts` | hằng số spacing, `generateTimelineNodes`, `calculateTimelineHeight`, `calculateItemPositions` |

## Dùng

```tsx
import Timeline from "@/features/timeline/components/Timeline";
import { generateTimelineNodes } from "@/features/timeline/utils/timeline-layout";

const nodes = generateTimelineNodes(entries);

<Timeline
  points={curvePoints}
  nodes={nodes}
  itemPositions={positions}
  scrollContainerRef={scrollRef}
  renderItem={({ data, style }) => <PhotoCard style={style} data={data} />}
/>;
```

`renderYear` bỏ trống thì dùng `YearIndicatorItem` mặc định.

## Lưu ý

- Component tự đo tiến trình cuộn bằng `useScroll` + `useSpring`; container cuộn phải được truyền vào qua `scrollContainerRef` (thường là `#root` của app).
- Chia `utils/` thành curve và layout để mỗi file chỉ còn một nhóm khái niệm; trước đây cả hai nằm trong `timeline-math.ts`.
