"use client";

import { useRouter } from "next/navigation";
import { Turntable } from "@/components/icon/turntable-icon";
import { HoverTooltip } from "@/components/ui/hover-tooltip";
import { useInventoryStore } from "@/hooks/use-inventory-store";
import { useQuestStore } from "@/hooks/use-quest-store";
import { InventoryItemID } from "@/types/inventory";
import { QuestID } from "@/types/quest";

export default function VongTayPage() {
	const router = useRouter();

	const completeQuest = useQuestStore((state) => state.completeQuest);
	const addItem = useInventoryStore((state) => state.addItem);

	const handleClick = () => {
		completeQuest(QuestID.FindTheMusicBox);
		addItem(InventoryItemID.MusicBox);

		setTimeout(() => router.push("/"), 5000);
	};

	return (
		<>
			<p>Ha Ha ngươi quá giỏiiiii, ta trả đồ lại cho người nèeeeee</p>
			<button
				type="button"
				onClick={handleClick}
				className="absolute -bottom-40 left-1/2 -translate-x-1/2 drop-shadow-2xl hover:drop-shadow-highlight cursor-pointer transition-all"
			>
				<HoverTooltip
					content="Dùng để tìm kiếm và phát nhạc!!"
					className="text-green-700 font-bold max-w-88"
					roughConfig={{ fill: "var(--color-green-200)" }}
				>
					<Turntable className=" w-80 rotate-9" />
				</HoverTooltip>
			</button>
		</>
	);
}
