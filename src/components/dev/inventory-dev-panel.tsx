"use client";

import { useState } from "react";
import { useInventoryStore } from "@/hooks/use-inventory-store";
import { ALL_INVENTORY_ITEMS, type InventoryItemID } from "@/types/inventory";
import cn from "@/utils/cn";
import { Button } from "../ui/button";

export function InventoryDevPanel() {
	const [isOpen, setIsOpen] = useState(false);

	const inventory = useInventoryStore((s) => s.inventory);
	const addItem = useInventoryStore((s) => s.addItem);
	const removeItem = useInventoryStore((s) => s.removeItem);

	const handleToggle = (itemId: InventoryItemID) => {
		if (inventory.has(itemId)) {
			removeItem(itemId);
		} else {
			addItem(itemId);
		}
	};

	return (
		<div className="fixed bottom-42 left-4 z-999 flex flex-col items-end gap-2">
			<Button
				onClick={() => setIsOpen(!isOpen)}
				className="size-12 text-white rounded-full shadow-lg flex items-center justify-center text-2xl"
				aria-label="Toggle Dev Panel"
			>
				{isOpen ? "❌" : "🔨"}
			</Button>

			{isOpen && (
				<div
					className={cn(
						"bg-yellow-50/80 backdrop-blur-sm shadow-lg border",
						"p-2 w-3xs",
						"animate-in fade-in-0 slide-in-from-bottom-2",
						"absolute -top-2 left-0 -translate-y-full",
					)}
				>
					<h3 className="font-bold mb-2">Quest DevTool</h3>
					<div className="flex flex-col gap-2 text-sm">
						{ALL_INVENTORY_ITEMS.map((item) => (
							<label
								key={item.id}
								className="flex items-center gap-2 cursor-pointer"
							>
								<input
									type="checkbox"
									className="size-4"
									checked={inventory.has(item.id)}
									onChange={() => handleToggle(item.id)}
								/>
								{item.name}
							</label>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
