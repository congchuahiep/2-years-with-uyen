"use client";

import { createContext, type ReactNode, useEffect, useState } from "react";
import { DevOnly } from "@/components/dev/dev-only";
import { QuestDevPanel } from "@/components/dev/quest-dev-panel";
import { useUpdateCompletedQuests } from "@/hooks/use-update-completed-quests";
import { createQuestStore, type QuestStoreApi } from "@/stores/quest-store";
import { createClient } from "@/utils/supabase/client";

export const QuestStoreContext = createContext<QuestStoreApi | undefined>(
	undefined,
);

export function QuestProvider({ children }: { children: ReactNode }) {
	const mutation = useUpdateCompletedQuests();
	const [store] = useState(() =>
		createQuestStore({
			onUpdateCompletedQuests: (allCompleted) => mutation.mutate(allCompleted),
		}),
	);

	const supabase = createClient();

	useEffect(() => {
		const fetchInitialQuests = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				const { data: profile } = await supabase
					.from("profiles")
					.select("completed_quests")
					.eq("id", user.id)
					.single();

				// Khởi tạo trạng thái store với dữ liệu từ DB
				store.getState().initialize(profile?.completed_quests || []);
			} else {
				// Nếu không có user, khởi tạo với mảng rỗng
				store.getState().initialize([]);
			}
		};
		fetchInitialQuests();
	}, [store, supabase]);

	return (
		<QuestStoreContext.Provider value={store}>
			{children}

			<DevOnly>
				<QuestDevPanel />
			</DevOnly>
		</QuestStoreContext.Provider>
	);
}
