"use client";

import { useEffect, useMemo } from "react";
import { useQuestStore } from "@/hooks/use-quest-store";
import type { QuestID } from "@/types/quest";

interface QuestGuardProps {
	requiredQuests: QuestID | QuestID[];
	onlyDuringQuest?: boolean;
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export function QuestGuard({
	requiredQuests,
	children,
	onlyDuringQuest,
	fallback = null,
}: QuestGuardProps) {
	const isLoading = useQuestStore((state) => state.isLoading);
	const activeQuests = useQuestStore((state) => state.activeQuests);

	const requiredQuestsArray = useMemo(
		() => (Array.isArray(requiredQuests) ? requiredQuests : [requiredQuests]),
		[requiredQuests],
	);

	const allRequiredCompleted = useQuestStore((state) =>
		requiredQuestsArray.every((id) => state.completedQuests.has(id)),
	);

	useEffect(() => {
		console.log(activeQuests);
	}, [activeQuests]);

	if (isLoading) return null;

	if (onlyDuringQuest)
		if (requiredQuestsArray.find((id) => activeQuests.includes(id)))
			return children;
		else return fallback;

	if (allRequiredCompleted) return children;

	return fallback;
}
