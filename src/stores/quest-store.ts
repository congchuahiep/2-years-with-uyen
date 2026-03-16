import confetti from "canvas-confetti";
import { createStore } from "zustand";
import { ALL_QUESTS, type Quest, type QuestID } from "@/types/quest";

export interface QuestStoreOptions {
	onCompleteQuest: (allCompleted: QuestID[]) => void;
}
export interface QuestState {
	completedQuests: Set<QuestID>;
	quests: Quest[];
	isLoading: boolean;
	initialize: (completedIds: QuestID[]) => void;
	isCompleted: (questId: QuestID) => boolean;
	canStart: (questId: QuestID) => boolean;
	completeQuest: (questId: QuestID) => void;
}

export const createQuestStore = (options: QuestStoreOptions) =>
	createStore<QuestState>((set, get) => ({
		completedQuests: new Set(),
		quests: ALL_QUESTS,
		isLoading: true,
		initialize: (completedIds) =>
			set({ completedQuests: new Set(completedIds), isLoading: false }),
		isCompleted: (questId) => get().completedQuests.has(questId),
		canStart: (questId) => {
			const quest = ALL_QUESTS.find((q) => q.id === questId);
			if (!quest) return false;
			return quest.dependencies.every((depId) =>
				get().completedQuests.has(depId),
			);
		},
		completeQuest: (questId) => {
			if (get().completedQuests.has(questId)) return;

			const newCompletedSet = new Set(get().completedQuests).add(questId);
			set({ completedQuests: newCompletedSet });

			options.onCompleteQuest(Array.from(newCompletedSet));
			confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
		},
	}));

export type QuestStoreApi = ReturnType<typeof createQuestStore>;
