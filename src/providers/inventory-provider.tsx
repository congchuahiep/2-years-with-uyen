"use client";

import { createContext, useEffect, useState } from "react";
import { DevOnly } from "@/components/dev/dev-only";
import { InventoryDevPanel } from "@/components/dev/inventory-dev-panel";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateInventory } from "@/hooks/use-update-inventory";
import {
	createInventoryStore,
	type InventoryStoreApi,
} from "@/stores/inventory-store";
import { createClient } from "@/utils/supabase/client";

export const InventoryStoreContext = createContext<
	InventoryStoreApi | undefined
>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
	const mutation = useUpdateInventory();
	const [store] = useState(() =>
		createInventoryStore({
			onUpdateInventoryItems: (inventoryItemIds) =>
				mutation.mutate(inventoryItemIds),
		}),
	);
	const [isLoading, setIsLoading] = useState(true);
	const supabase = createClient();

	useEffect(() => {
		const fetchInitialQuests = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				const { data: profile } = await supabase
					.from("profiles")
					.select("inventory")
					.eq("id", user.id)
					.single();

				// Khởi tạo trạng thái store với dữ liệu từ DB
				store.getState().initialize(profile?.inventory || []);
			} else {
				// Nếu không có user, khởi tạo với mảng rỗng
				store.getState().initialize([]);
			}

			setIsLoading(false);
		};
		fetchInitialQuests();
	}, [store, supabase]);

	if (isLoading)
		return (
			<div className="flex h-screen flex-1 justify-center items-center gap-2 bg-rose-300">
				<Spinner /> Loading...
			</div>
		);

	return (
		<InventoryStoreContext.Provider value={store}>
			{children}

			<DevOnly>
				<InventoryDevPanel />
			</DevOnly>
		</InventoryStoreContext.Provider>
	);
}
