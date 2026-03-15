import confetti from "canvas-confetti";
import { createStore } from "zustand";
import { ALL_QUESTS, type Quest, type QuestID } from "@/types/quest";

export interface QuestState {
	completedQuests: Set<QuestID>;
	quests: Quest[];
	isLoading: boolean;
	initialize: (completedIds: QuestID[]) => void;
	isCompleted: (questId: QuestID) => boolean;
	canStart: (questId: QuestID) => boolean;
	completeQuest: (questId: QuestID) => void;
}

export const createQuestStore = () =>
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
			set((state) => ({
				completedQuests: new Set(state.completedQuests).add(questId),
			}));
			// Logic gọi API để lưu vào DB sẽ được thêm ở đây
			confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
		},
	}));

export type QuestStoreApi = ReturnType<typeof createQuestStore>;
