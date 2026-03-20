import { useContext } from "react";
import { useStore } from "zustand";
import { InventoryStoreContext } from "@/providers/inventory-provider";
import type { InventoryState } from "@/stores/inventory-store";

export function useInventoryStore<T>(
	selector: (state: InventoryState) => T,
): T {
	const storeApi = useContext(InventoryStoreContext);
	if (!storeApi) {
		throw new Error(`useInventoryStore must be used within InventoryProvider`);
	}
	return useStore(storeApi, selector);
}
