import type { JSX } from "react";
import { KeyIcon } from "@/components/icon/key";
import { Turntable } from "@/components/icon/turntable-icon";

export enum InventoryItemID {
	SpecialKey = "SPECIAL_KEY",
	MusicBox = "MUSIC_BOX",
}

export interface InventoryItem {
	id: InventoryItemID;
	name: string;
	description: string;
	icon: JSX.Element;
}

export const ALL_INVENTORY_ITEMS: InventoryItem[] = [
	{
		id: InventoryItemID.SpecialKey,
		name: "Chìa khoá đặc biệt",
		description: "Dùng để mở khoá tính năng tạo 'khoảng khắc'!",
		icon: (
			<KeyIcon
				roughConfig={{
					strokeWidth: 0.5,
					roughness: 0.2,
					stroke: "var(--color-yellow-100)",
					fill: "var(--color-yellow-400)",
					fillStyle: "solid",
				}}
			/>
		),
	},
	{
		id: InventoryItemID.MusicBox,
		name: "Hộp chơi nhạc",
		description: "Dùng để tìm kiếm và phát nhạc!",
		icon: <Turntable />,
	},
];
