import type { RichMoment } from "@/types/moment";
import type { TimelineItem, TimelinePoint } from "@/types/timeline";

export const BASE_LINE = [
	{ x: 0, y: 0 },
	{ x: 70, y: 4 },
	{ x: 35, y: 16 },
	{ x: 100, y: 29 },
	{ x: 10, y: 41 },
	{ x: 100, y: 45 },
	{ x: 62, y: 55 },
	{ x: 93, y: 68 },
	{ x: 30, y: 80 },
	{ x: 70, y: 92 },
];
export const MOMENT_ITEM_SPACING_VH = 35;
export const YEAR_INDICATOR_SPACING_VH = 40;
export const PADDING_TOP_VH = 86;
export const PADDING_BOTTOM_VH = 20;
export const BASE_LINE_CYCLE_VH = 200;

export function getXatY(y: number, points: TimelinePoint[]) {
	if (points.length === 0) return 50;
	for (let i = 0; i < points.length - 1; i++) {
		const p1 = points[i];
		const p2 = points[i + 1];
		const minY = Math.min(p1.y, p2.y);
		const maxY = Math.max(p1.y, p2.y);
		if (y >= minY && y <= maxY) {
			const segmentYRange = p2.y - p1.y;
			if (Math.abs(segmentYRange) < 0.0001) return p1.x;
			const t = (y - p1.y) / segmentYRange;
			return p1.x + t * (p2.x - p1.x);
		}
	}
	if (y <= 0)
		return (
			points.find((p) => p.y === Math.min(...points.map((pt) => pt.y)))?.x || 50
		);
	return (
		points.find((p) => p.y === Math.max(...points.map((pt) => pt.y)))?.x || 50
	);
}

export function generateDenseCurvePoints(
	points: TimelinePoint[],
	segments = 20,
): TimelinePoint[] {
	if (points.length < 2) return points;
	const densePoints: TimelinePoint[] = [];
	for (let i = 0; i < points.length - 1; i++) {
		const p0 =
			i === 0
				? { x: 2 * points[0].x - points[1].x, y: 2 * points[0].y - points[1].y }
				: points[i - 1];
		const p1 = points[i];
		const p2 = points[i + 1];
		const p3 =
			i === points.length - 2
				? {
						x: 2 * points[i + 1].x - points[i].x,
						y: 2 * points[i + 1].y - points[i].y,
					}
				: points[i + 2];
		for (let j = 0; j < segments; j++) {
			const t = j / segments;
			const t2 = t * t;
			const t3 = t2 * t;
			const vx0 = (p2.x - p0.x) * 0.5;
			const vx1 = (p3.x - p1.x) * 0.5;
			const x =
				(2 * p1.x - 2 * p2.x + vx0 + vx1) * t3 +
				(-3 * p1.x + 3 * p2.x - 2 * vx0 - vx1) * t2 +
				vx0 * t +
				p1.x;
			const vy0 = (p2.y - p0.y) * 0.5;
			const vy1 = (p3.y - p1.y) * 0.5;
			const y =
				(2 * p1.y - 2 * p2.y + vy0 + vy1) * t3 +
				(-3 * p1.y + 3 * p2.y - 2 * vy0 - vy1) * t2 +
				vy0 * t +
				p1.y;
			densePoints.push({ x, y });
		}
	}
	densePoints.push(points[points.length - 1]);
	return densePoints;
}

export function generateBaseCurve(totalHeightVh: number): TimelinePoint[] {
	const topToBottomPoints: TimelinePoint[] = [];
	const maxCycles = Math.ceil(totalHeightVh / BASE_LINE_CYCLE_VH);
	for (let c = 0; c < maxCycles; c++) {
		for (let i = 0; i < BASE_LINE.length; i++) {
			if (c > 0 && i === 0) continue;
			const p = BASE_LINE[i];
			const currentYVh =
				c * BASE_LINE_CYCLE_VH + (p.y / 100) * BASE_LINE_CYCLE_VH;
			if (currentYVh > totalHeightVh) break;
			const x = c % 2 === 0 ? p.x : 100 - p.x;
			const yPct = (currentYVh / totalHeightVh) * 100;
			topToBottomPoints.push({ x, y: yPct });
		}
	}
	if (
		topToBottomPoints.length > 0 &&
		topToBottomPoints[topToBottomPoints.length - 1].y < 100
	) {
		const lastPoint = topToBottomPoints[topToBottomPoints.length - 1];
		topToBottomPoints.push({ x: lastPoint.x, y: 100 });
	}
	return [...topToBottomPoints].reverse();
}

export function generateTimelineItems(moments: RichMoment[]): TimelineItem[] {
	if (moments.length === 0) return [];
	const timelineItems: TimelineItem[] = [];
	let lastYear: number | null = null;
	moments.forEach((moment) => {
		const currentYear = new Date(moment.event_date).getFullYear();
		if (lastYear === null) {
			lastYear = currentYear;
			timelineItems.push({ type: "year_indicator", year: currentYear });
		} else if (currentYear < lastYear) {
			lastYear = currentYear;
			timelineItems.push({ type: "year_indicator", year: currentYear });
		}
		timelineItems.push({ type: "moment", data: moment });
	});
	return timelineItems;
}

export function calculateTimelineHeight(items: TimelineItem[]): number {
	if (items.length <= 1) return 100;
	let totalHeight = PADDING_TOP_VH + PADDING_BOTTOM_VH;
	for (let i = 1; i < items.length; i++) {
		const prevItem = items[i - 1];
		const currentItem = items[i];
		if (
			prevItem.type === "year_indicator" ||
			currentItem.type === "year_indicator"
		) {
			totalHeight += YEAR_INDICATOR_SPACING_VH;
		} else {
			totalHeight += MOMENT_ITEM_SPACING_VH;
		}
	}
	return Math.max(100, totalHeight);
}

export function calculateItemPositions(
	items: TimelineItem[],
	totalHeightVh: number,
	curvePoints: TimelinePoint[],
): TimelinePoint[] {
	if (items.length === 0) return [];
	const denseCurvePoints = generateDenseCurvePoints(curvePoints, 20);
	const positions: TimelinePoint[] = [];
	let currentY_vh = PADDING_TOP_VH;
	positions.push({
		x: getXatY((currentY_vh / totalHeightVh) * 100, denseCurvePoints),
		y: (currentY_vh / totalHeightVh) * 100,
	});
	for (let i = 1; i < items.length; i++) {
		const prevItem = items[i - 1];
		const currentItem = items[i];
		if (
			prevItem.type === "year_indicator" ||
			currentItem.type === "year_indicator"
		) {
			currentY_vh += YEAR_INDICATOR_SPACING_VH;
		} else {
			currentY_vh += MOMENT_ITEM_SPACING_VH;
		}
		const yPct = (currentY_vh / totalHeightVh) * 100;
		const xPct = getXatY(yPct, denseCurvePoints);
		positions.push({ x: xPct, y: yPct });
	}
	return positions;
}
