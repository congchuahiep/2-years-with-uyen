import { notFound } from "next/navigation";
import type { RichMoment } from "@/types/moment";
import { createClient } from "@/utils/supabase/server";
import { ModalMomentDetailView } from "./view";

export default async function MomentModal({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: momentId } = await params;

	const supabase = await createClient();
	const { data: moment, error } = await supabase
		.from("moments")
		.select(
			`
      *,
      author:profiles (
        first_name,
        last_name,
        avatar_url
      )
    `,
		)
		.eq("id", momentId)
		.single<RichMoment>();

	if (error || !moment) {
		notFound();
	}

	return <ModalMomentDetailView moment={moment} />;
}
