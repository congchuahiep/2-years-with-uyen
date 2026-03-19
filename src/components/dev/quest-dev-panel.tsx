"use client";

import { useState } from "react";
import { useQuestStore } from "@/hooks/use-quest-store";
import type { QuestID } from "@/types/quest";
import cn from "@/utils/cn";
import { Button } from "../ui/button";

export function QuestDevPanel() {
	const [isOpen, setIsOpen] = useState(false);

	const quests = useQuestStore((s) => s.quests);
	const isCompleted = useQuestStore((s) => s.isCompleted);
	const completeQuest = useQuestStore((s) => s.completeQuest);
	const uncompleteQuest = useQuestStore((s) => s.uncompleteQuest);

	const handleToggle = (questId: QuestID) => {
		if (isCompleted(questId)) {
			uncompleteQuest(questId);
		} else {
			completeQuest(questId);
		}
	};

	return (
		<div className="fixed bottom-24 left-4 z-999 flex flex-col items-end gap-2">
			<Button
				onClick={() => setIsOpen(!isOpen)}
				className="size-12 text-white rounded-full shadow-lg flex items-center justify-center text-2xl"
				aria-label="Toggle Dev Panel"
			>
				{isOpen ? "❌" : "🔨"}
			</Button>

			{isOpen && (
				<div
					className={cn(
						"bg-yellow-50/80 backdrop-blur-sm shadow-lg border",
						"p-2 w-3xs",
						"animate-in fade-in-0 slide-in-from-bottom-2",
						"absolute -top-2 left-0 -translate-y-full",
					)}
				>
					<h3 className="font-bold mb-2">Quest DevTool</h3>
					<div className="flex flex-col gap-2 text-sm">
						{quests.map((quest) => (
							<label
								key={quest.id}
								className="flex items-center gap-2 cursor-pointer"
							>
								<input
									type="checkbox"
									className="size-4"
									checked={isCompleted(quest.id)}
									onChange={() => handleToggle(quest.id)}
								/>
								{quest.title}
							</label>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
