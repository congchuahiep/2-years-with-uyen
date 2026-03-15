import type { RichMoment } from "@/types/moment";
import { createClient } from "@/utils/supabase/server";
import {
	calculateItemPositions,
	calculateTimelineHeight,
	generateBaseCurve,
	generateTimelineItems,
} from "@/utils/timeline";
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
	const timelineItems = generateTimelineItems(moments);

	const totalHeightVh = calculateTimelineHeight(timelineItems);
	const curvePoints = generateBaseCurve(totalHeightVh);

	const itemPositions = calculateItemPositions(
		timelineItems,
		totalHeightVh,
		curvePoints,
	);

	return (
		<HomeView
			curvePoints={curvePoints}
			itemPositions={itemPositions}
			timelineItems={timelineItems}
			totalHeightVh={totalHeightVh}
		/>
	);
}
