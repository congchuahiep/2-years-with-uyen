import type { RichMoment } from "./moment";

export type TimelineItem =
	| { type: "moment"; data: RichMoment }
	| { type: "year_indicator"; year: number };

export interface TimelinePoint {
	x: number;
	y: number;
}
