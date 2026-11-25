import type { TimelineEntry } from "../types/timeline-entry";
import type { TimelineNode } from "../types/timeline-node";
import type { TimelinePoint } from "../types/timeline-point";
import { generateDenseCurvePoints, getXatY } from "./timeline-curve";

export const ITEM_SPACING_VH = 35;
export const YEAR_INDICATOR_SPACING_VH = 40;
export const PADDING_TOP_VH = 86;
export const PADDING_BOTTOM_VH = 20;

/**
 * Chèn mốc năm xen giữa các entry. Danh sách đầu vào được kỳ vọng đã sắp
 * xếp mới → cũ; mỗi khi năm giảm, một mốc năm mới được thêm vào.
 */
export function generateTimelineNodes<T>(
  entries: TimelineEntry<T>[],
): TimelineNode<T>[] {
  if (entries.length === 0) return [];
  const nodes: TimelineNode<T>[] = [];
  let lastYear: number | null = null;
  for (const entry of entries) {
    const year = new Date(entry.date).getFullYear();
    if (lastYear === null || year < lastYear) {
      lastYear = year;
      nodes.push({ type: "year", year });
    }
    nodes.push({ type: "item", id: entry.id, data: entry.data });
  }
  return nodes;
}

export function calculateTimelineHeight(
  nodes: TimelineNode<unknown>[],
): number {
  if (nodes.length <= 1) return 100;
  let totalHeight = PADDING_TOP_VH + PADDING_BOTTOM_VH;
  for (let i = 1; i < nodes.length; i++) {
    const prevNode = nodes[i - 1];
    const currentNode = nodes[i];
    if (prevNode.type === "year" || currentNode.type === "year") {
      totalHeight += YEAR_INDICATOR_SPACING_VH;
    } else {
      totalHeight += ITEM_SPACING_VH;
    }
  }
  return Math.max(100, totalHeight);
}

export function calculateItemPositions<T>(
  nodes: TimelineNode<T>[],
  totalHeightVh: number,
  curvePoints: TimelinePoint[],
): TimelinePoint[] {
  if (nodes.length === 0) return [];
  const denseCurvePoints = generateDenseCurvePoints(curvePoints, 20);
  const positions: TimelinePoint[] = [];
  let currentY_vh = PADDING_TOP_VH;
  positions.push({
    x: getXatY((currentY_vh / totalHeightVh) * 100, denseCurvePoints),
    y: (currentY_vh / totalHeightVh) * 100,
  });
  for (let i = 1; i < nodes.length; i++) {
    const prevNode = nodes[i - 1];
    const currentNode = nodes[i];
    if (prevNode.type === "year" || currentNode.type === "year") {
      currentY_vh += YEAR_INDICATOR_SPACING_VH;
    } else {
      currentY_vh += ITEM_SPACING_VH;
    }
    const yPct = (currentY_vh / totalHeightVh) * 100;
    const xPct = getXatY(yPct, denseCurvePoints);
    positions.push({ x: xPct, y: yPct });
  }
  return positions;
}
