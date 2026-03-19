import confetti from "canvas-confetti";
import { createStore } from "zustand";
import { ALL_QUESTS, type Quest, type QuestID } from "@/types/quest";

export interface QuestStoreOptions {
	onUpdateCompletedQuests: (allCompleted: QuestID[]) => void;
}

interface QuestData {
	completedQuests: Set<QuestID>;
	quests: Quest[];
	isLoading: boolean;
}

interface QuestActions {
	initialize: (completedIds: QuestID[]) => void;
	isCompleted: (questId: QuestID) => boolean;

	/**
	 * Kiểm tra xem một nhiệm vụ có thể bắt đầu hay không
	 *
	 * @param questId
	 * @returns
	 */
	canStart: (questId: QuestID) => boolean;

	/**
	 * Đánh dấu một nhiệm vụ đã hoàn thành, nếu nhiệm vụ đã hoàn thành thì
	 * không làm gì cả
	 * @param questId
	 * @returns
	 */
	completeQuest: (questId: QuestID) => void;

	/**
	 * Đánh dấu một nhiệm vụ chưa hoàn thành, nếu nhiệm vụ chưa hoàn thành thì
	 * không làm gì cả
	 *
	 * @param questId
	 * @returns
	 */
	uncompleteQuest: (questId: QuestID) => void;
}

export type QuestState = QuestData & QuestActions;

export const createQuestStore = (options: QuestStoreOptions) =>
	createStore<QuestState>((set, get) => ({
		// INITIAL STATE
		completedQuests: new Set(),
		quests: ALL_QUESTS,
		isLoading: true,

		// ACTIONS
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
			const { completedQuests } = get();
			if (completedQuests.has(questId)) return;

			const newCompletedSet = new Set(completedQuests).add(questId);
			set({ completedQuests: newCompletedSet });

			options.onUpdateCompletedQuests(Array.from(newCompletedSet));
			confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
			const colors = ["#bb0000", "#ffffff"];
			const end = Date.now() + 5 * 1000;

			(function frame() {
				confetti({
					particleCount: 2,
					angle: 60,
					spread: 55,
					origin: { x: 0 },
					colors: colors,
				});
				confetti({
					particleCount: 2,
					angle: 120,
					spread: 55,
					origin: { x: 1 },
					colors: colors,
				});

				if (Date.now() < end) {
					requestAnimationFrame(frame);
				}
			})();
		},

		uncompleteQuest: (questId) => {
			const { completedQuests } = get();
			if (!completedQuests.has(questId)) return;

			const newCompletedSet = new Set(completedQuests);
			newCompletedSet.delete(questId);

			set({ completedQuests: newCompletedSet });
			options.onUpdateCompletedQuests(Array.from(newCompletedSet));
		},
	}));

export type QuestStoreApi = ReturnType<typeof createQuestStore>;
