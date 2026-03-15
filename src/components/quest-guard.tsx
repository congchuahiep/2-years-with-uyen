"use client";
import { useQuestStore } from "@/hooks/use-quest-store";
import type { QuestID } from "@/types/quest";

interface QuestGuardProps {
	requiredQuests: QuestID[];
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export function QuestGuard({
	requiredQuests,
	children,
	fallback = null,
}: QuestGuardProps) {
	const isLoading = useQuestStore((state) => state.isLoading);
	const isCompleted = useQuestStore((state) => state.isCompleted);

	if (isLoading) return null;

	const allRequiredCompleted = requiredQuests.every((id) => isCompleted(id));

	if (allRequiredCompleted) {
		return children;
	}
	return fallback;
}
