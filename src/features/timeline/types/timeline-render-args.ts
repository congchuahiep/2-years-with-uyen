import type { MotionValue } from "motion/react";
import type { CSSProperties } from "react";

/** Tham số mà nơi dùng nhận được khi tự render một item dữ liệu. */
export interface TimelineRenderItemArgs<T> {
  data: T;
  index: number;
  align: "left" | "right";
  /** Style đã tính sẵn: top/left theo % và độ xoay nhịp nhàng. */
  style: CSSProperties;
  yPct: number;
  currentDrawYPercent: MotionValue<number>;
}

/** Tham số mà nơi dùng nhận được khi tự render một mốc năm. */
export interface TimelineRenderYearArgs {
  year: number;
  index: number;
  style: CSSProperties;
  yPct: number;
  currentDrawYPercent: MotionValue<number>;
}
