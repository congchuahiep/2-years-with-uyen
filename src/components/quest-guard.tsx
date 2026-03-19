"use client";

import { useMemo } from "react";
import { useQuestStore } from "@/hooks/use-quest-store";
import type { QuestID } from "@/types/quest";

interface QuestGuardProps {
	requiredQuests: QuestID | QuestID[];
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export function QuestGuard({
	requiredQuests,
	children,
	fallback = null,
}: QuestGuardProps) {
	const isLoading = useQuestStore((state) => state.isLoading);

	const requiredQuestsArray = useMemo(
		() => (Array.isArray(requiredQuests) ? requiredQuests : [requiredQuests]),
		[requiredQuests],
	);

	const allRequiredCompleted = useQuestStore((state) =>
		requiredQuestsArray.every((id) => state.completedQuests.has(id)),
	);

	if (isLoading) return null;

	if (allRequiredCompleted) {
		return children;
	}
	return fallback;
}
