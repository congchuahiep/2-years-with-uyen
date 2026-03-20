import { createStore } from "zustand";
import type { InventoryItemID } from "@/types/inventory";

export interface InventoryStoreOptions {
	onUpdateInventoryItems: (inventoryItemIds: InventoryItemID[]) => void;
}

interface InventoryData {
	inventory: Set<InventoryItemID>;
	isLoading: boolean;
}

interface InventoryActions {
	initialize: (inventoryItemIds: InventoryItemID[]) => void;
	addItem: (itemId: InventoryItemID) => void;
	removeItem: (itemId: InventoryItemID) => void;
}

export type InventoryState = InventoryData & InventoryActions;

export const createInventoryStore = (options: InventoryStoreOptions) =>
	createStore<InventoryState>((set, get) => ({
		inventory: new Set(),
		isLoading: true,

		initialize: (inventoryItemIds: InventoryItemID[]) => {
			set({ inventory: new Set(inventoryItemIds), isLoading: false });
		},

		addItem: (itemId: InventoryItemID) => {
			const { inventory } = get();
			const newInventory = inventory;
			newInventory.add(itemId);
			options.onUpdateInventoryItems(Array.from(newInventory));
			set({ inventory: newInventory });
		},

		removeItem: (itemId: InventoryItemID) => {
			const { inventory } = get();
			const newInventory = inventory;
			newInventory.delete(itemId);
			options.onUpdateInventoryItems(Array.from(newInventory));
			set({ inventory: newInventory });
		},
	}));

export type InventoryStoreApi = ReturnType<typeof createInventoryStore>;
