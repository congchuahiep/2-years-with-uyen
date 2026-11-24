import {
	calculateItemPositions,
	calculateTimelineHeight,
	generateBaseCurve,
	generateTimelineNodes,
} from "@/features/timeline";
import type { RichMoment } from "@/types/moment";
import { createClient } from "@/utils/supabase/server";
import { HomeView } from "./view";

export default async function HomePage() {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("moments")
		.select(
			`
      *,
      profiles (
        first_name,
        last_name,
        avatar_url
      )
    `,
		)
		.neq("status", "draft")
		.order("event_date", { ascending: false });

	if (error) {
		console.error("Lỗi truy vấn moments:", error);
		throw new Error(
			"Không thể tải dữ liệu cho dòng thời gian. Vui lòng thử lại sau.",
		);
	}

	const moments: RichMoment[] = data || [];
	const timelineNodes = generateTimelineNodes(
		moments.map((moment) => ({
			id: moment.id,
			date: moment.event_date,
			data: moment,
		})),
	);

	const totalHeightVh = calculateTimelineHeight(timelineNodes);
	const curvePoints = generateBaseCurve(totalHeightVh);

	const itemPositions = calculateItemPositions(
		timelineNodes,
		totalHeightVh,
		curvePoints,
	);

	return (
		<HomeView
			curvePoints={curvePoints}
			itemPositions={itemPositions}
			timelineNodes={timelineNodes}
			totalHeightVh={totalHeightVh}
		/>
	);
}
