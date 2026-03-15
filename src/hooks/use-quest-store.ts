import { useContext } from "react";
import { useStore } from "zustand";
import { QuestStoreContext } from "@/providers/quest-provider";
import type { QuestState } from "@/stores/quest-store";

export function useQuestStore<T>(selector: (state: QuestState) => T): T {
	const storeApi = useContext(QuestStoreContext);
	if (!storeApi) {
		throw new Error(`useQuestStore must be used within QuestProvider`);
	}
	return useStore(storeApi, selector);
}
