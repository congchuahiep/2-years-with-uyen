"use client";

import { useMemo, useRef, useState } from "react";
import { RoughNotation } from "react-rough-notation";
import { ArrowIcon } from "@/components/icon/arrow";
import { QuestGuard } from "@/components/quest-guard";
import { BinderPaper } from "@/components/ui/binder-paper";
import { Button } from "@/components/ui/button";
import {
	type ContentChunk,
	useContentPagination,
} from "@/hooks/use-content-pagination";
import { useQuestStore } from "@/hooks/use-quest-store";
import { ALL_QUESTS, type Quest, QuestID } from "@/types/quest";
import cn from "@/utils/cn";

const renderChunk = (chunk: ContentChunk) => {
	if (chunk.type === "title") {
		return (
			<h3
				className={cn(
					"font-bold",
					chunk.isCompleted && "line-through opacity-50",
				)}
			>
				{chunk.content} {chunk.isCompleted && "✅"}
			</h3>
		);
	}
	return (
		<p
			className={cn(
				"text-gray-950 whitespace-pre-wrap pb-6",
				chunk.isCompleted && "opacity-50",
			)}
		>
			{chunk.content}
		</p>
	);
};

export function QuestView() {
	const activeQuests = useQuestStore((s) => s.activeQuests);
	const completedQuests = useQuestStore((s) => s.completedQuests);
	const completeQuest = useQuestStore((s) => s.completeQuest);
	const isLoading = useQuestStore((s) => s.isLoading);
	const containerRef = useRef<HTMLDivElement>(null);
	const [currentPageIndex, setCurrentPageIndex] = useState(0);

	const completedQuestsArray = useMemo(
		() => Array.from(completedQuests),
		[completedQuests],
	);

	// Tạo danh sách quests bao gồm cả active và completed
	// Active quests hiển thị trước, completed quests hiển thị sau
	const questsForPagination = useMemo(() => {
		const relevantQuestIds = [
			...new Set([...activeQuests, ...completedQuestsArray]),
		];

		const relevantQuests = relevantQuestIds
			.map((id) => ALL_QUESTS.find((q) => q.id === id))
			.filter((q): q is Quest => q !== undefined);

		const activeQuestsList = relevantQuests.filter((q) =>
			activeQuests.includes(q.id),
		);
		const completedQuestsList = relevantQuests.filter((q) =>
			completedQuestsArray.includes(q.id),
		);

		const sortedActive = activeQuestsList.sort((a, b) => b.index - a.index);
		const sortedCompleted = completedQuestsList.sort(
			(a, b) => b.index - a.index,
		);

		return [...sortedActive, ...sortedCompleted];
	}, [activeQuests, completedQuestsArray]);

	const { pages, measureRef } = useContentPagination({
		containerRef,
		quests: questsForPagination,
		completedQuests: completedQuestsArray,
		enabled: !isLoading && questsForPagination.length > 0,
		padding: 96,
	});

	const handlePrevPage = () => {
		setCurrentPageIndex((prev) => Math.max(0, prev - 1));
	};

	const handleNextPage = () => {
		setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1));
	};

	const currentPageContent = pages[currentPageIndex];

	// ClassName cho content area của BinderPaper
	const contentAreaClassName = "md:pl-19 p-4 pt-9";

	return (
		<div className="w-full h-full flex flex-col items-center gap-4">
			{/*
        Div ẩn để đo đạc.
        Quan trọng: Nó phải có class y hệt content area của BinderPaper để có cùng chiều rộng.
      */}
			<div
				id="measure-div"
				ref={measureRef}
				className={cn("absolute invisible -z-10 w-full", contentAreaClassName)}
			/>

			<BinderPaper
				ref={containerRef}
				className="min-h-132 w-full"
				containerClassName={contentAreaClassName} // Truyền class vào
			>
				<h2 className="text-2xl font-bold font-display text-blue-600 pb-6 w-fit">
					<RoughNotation
						type="underline"
						color="var(--color-blue-600)"
						padding={-2}
						show
					>
						Nhiệm vụ cần làm
					</RoughNotation>
				</h2>

				{isLoading ? (
					<p>Đang tải danh sách nhiệm vụ...</p>
				) : questsForPagination.length === 0 ? (
					<p>Chúc mừng! Bạn đã hoàn thành tất cả nhiệm vụ!</p>
				) : (
					<div>
						{currentPageContent?.map((chunk, index) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: Thích
								key={`${chunk.questId}-${index}`}
							>
								{renderChunk(chunk)}
							</div>
						))}
					</div>
				)}
			</BinderPaper>

			<QuestGuard requiredQuests={QuestID.Intro} onlyDuringQuest>
				<Button onClick={() => completeQuest(QuestID.Intro)}>Bắt đầu</Button>
			</QuestGuard>

			{pages.length > 1 && (
				<div className="flex items-center justify-between w-full p-2 rounded-lg">
					<Button
						perspective="right"
						onClick={handlePrevPage}
						disabled={currentPageIndex === 0}
						fill="var(--color-amber-200)"
						buttonSize="small"
					>
						<ArrowIcon
							variant="thick"
							className="rotate-180 scale-150"
							roughConfig={{
								fill: "var(--color-blue-400)",
								fillStyle: "solid",
							}}
						/>
						Trang trước
					</Button>

					<Button
						perspective="left"
						onClick={handleNextPage}
						disabled={currentPageIndex === pages.length - 1}
						fill="var(--color-amber-200)"
						buttonSize="small"
					>
						Trang sau
						<ArrowIcon
							variant="thick"
							className="scale-150"
							roughConfig={{
								fill: "var(--color-blue-400)",
								fillStyle: "solid",
							}}
						/>
					</Button>
				</div>
			)}
		</div>
	);
}
