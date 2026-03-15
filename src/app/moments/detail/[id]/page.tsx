import Image from "next/image";
import { notFound } from "next/navigation";
import { RoughBox } from "@/components/ui/rough-box";
import type { RichMoment } from "@/types/moment";
import { createClient } from "@/utils/supabase/server";

export default async function MomentDetailPage({
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
      profiles (
        first_name,
        last_name,
        avatar_url
      )
    `,
		)
		.eq("id", momentId)
		.single<RichMoment>();

	if (error || !moment) {
		console.error("Error fetching moment:", error);
		notFound();
	}

	const author = moment.author;

	return (
		<main className="min-h-screen bg-amber-50/20 py-12 px-4 flex justify-center">
			<div className="w-full max-w-3xl">
				<RoughBox
					roughConfig={{
						bowing: 2,
						roughness: 1.5,
						stroke: "var(--color-slate-300)",
						strokeWidth: 1.5,
						fillStyle: "solid",
						fill: "var(--color-white)",
					}}
					className="p-8 md:p-12"
				>
					<article className="prose prose-lg max-w-none">
						<header className="mb-8 border-b-2 border-slate-200 pb-4">
							<h1 className="mb-2 text-3xl md:text-4xl font-display">
								{moment.title}
							</h1>
							<div className="flex items-center gap-3 text-base text-slate-600">
								{author?.avatar_url && (
									<Image
										src={author.avatar_url}
										alt={author.first_name || ""}
										width={40}
										height={40}
										className="rounded-full border-2 border-slate-200 p-0.5"
									/>
								)}
								<span className="font-semibold">
									{author?.first_name} {author?.last_name}
								</span>
								<span className="text-slate-400">&bull;</span>
								<time dateTime={moment.event_date}>
									{new Date(moment.event_date).toLocaleDateString("vi-VN", {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								</time>
							</div>
						</header>

						{moment.content && <p className="lead">{moment.content}</p>}

						{moment.images && moment.images.length > 0 && (
							<div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 not-prose">
								{moment.images.map((img, index) => (
									<div
										key={`${img.url}-[${index}]`}
										className="relative aspect-square"
									>
										<Image
											src={img.url}
											alt={`Ảnh "${moment.title}" - ${index + 1}`}
											fill
											className="object-cover rounded-md"
										/>
									</div>
								))}
							</div>
						)}
					</article>
				</RoughBox>
			</div>
		</main>
	);
}
