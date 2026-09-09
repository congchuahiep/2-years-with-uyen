import type { JSX } from "react";
import { BowIcon } from "@/components/icon/bow";
import { DaisyIcon } from "@/components/icon/daisy";
import { HeartIcon } from "@/components/icon/heart";
import { ShootingStarIcon } from "@/components/icon/shooting-star";
import { StarIcon } from "@/components/icon/star";

/**
 * Catalog sticker — danh sách sticker người dùng có thể kéo lên trang.
 * Mỗi sticker = 1 phần tử Doodle vẽ tay; khi đặt lên trang,
 * `page_items.item_id` lưu chính `id` của sticker này.
 */
export interface StickerType {
	id: string;
	label: string;
	icon: JSX.Element;
}

export const STICKER_CATALOG: StickerType[] = [
	{
		id: "heart",
		label: "Trái tim",
		icon: (
			<HeartIcon
				className="size-10"
				roughConfig={{
					stroke: "var(--color-pink-500)",
					strokeWidth: 1,
					fill: "var(--color-pink-300)",
					fillStyle: "zigzag",
				}}
			/>
		),
	},
	{
		id: "star",
		label: "Ngôi sao",
		icon: (
			<StarIcon
				className="size-10"
				roughConfig={{
					stroke: "var(--color-yellow-500)",
					fill: "var(--color-yellow-300)",
					fillWeight: 8,
				}}
			/>
		),
	},
	{
		id: "daisy",
		label: "Hoa cúc",
		icon: <DaisyIcon className="size-12" />,
	},
	{
		id: "bow",
		label: "Nơ ruy băng",
		icon: (
			<BowIcon
				className="size-11"
				roughConfig={{
					stroke: "var(--color-pink-400)",
					fill: "var(--color-pink-300)",
					fillWeight: 3,
				}}
			/>
		),
	},
	{
		id: "shooting-star",
		label: "Sao băng",
		icon: (
			<ShootingStarIcon
				className="size-10"
				roughConfig={{ stroke: "var(--color-yellow-400)" }}
			/>
		),
	},
];

const STICKER_MAP = new Map(
	STICKER_CATALOG.map((sticker) => [sticker.id, sticker]),
);

/** Lấy icon sticker theo id — mặc định ngôi sao nếu id lạ (dữ liệu cũ) */
export function getStickerIcon(stickerId: string): JSX.Element {
	const sticker = STICKER_MAP.get(stickerId) ?? STICKER_CATALOG[1]; // star
	return sticker.icon;
}