"use client";

import { QuestView } from "@/app/quest/view";
import { BackButton } from "@/components/back-button";
import { KeyIcon } from "@/components/icon/key";
import { LockIcon } from "@/components/icon/lock-icon";
import { PuzzleGame } from "@/components/puzzle-game";
import { QuestGuard } from "@/components/quest-guard";
import { HoverTooltip } from "@/components/ui/hover-tooltip";
import MinecraftChest from "@/components/ui/minecraft-chest";
import { RoughBox } from "@/components/ui/rough-box";
import { RoughTag } from "@/components/ui/rough-tag";
import { useQuestStore } from "@/hooks/use-quest-store";
import { QuestID } from "@/types/quest";
import cn from "@/utils/cn";

export default function QuestPage() {
	const completeQuest = useQuestStore((state) => state.completeQuest);

	return (
		<main className="h-screen relative">
			<BackButton />

			<div className="absolute top-1/2 left-0">
				<QuestGuard
					requiredQuests={[
						QuestID.FragmentOfMoment1,
						QuestID.FragmentOfMoment2,
					]}
					onlyDuringQuest
				>
					<button
						type="button"
						className="absolute inset-0 z-10 cursor-pointer"
						onClick={() =>
							completeQuest([
								QuestID.FragmentOfMoment1,
								QuestID.FragmentOfMoment2,
							])
						}
					/>
				</QuestGuard>

				<MinecraftChest className="rotate-y-180 cursor-pointer drop-shadow-md">
					<MysteryChest />
				</MinecraftChest>
			</div>

			<div
				className={cn(
					"w-full max-w-md",
					"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
				)}
			>
				<QuestView />
			</div>
		</main>
	);
}

function MysteryChest() {
	const completeQuest = useQuestStore((state) => state.completeQuest);

	const handleWin = () => {
		completeQuest(QuestID.MysteryChest);
	};

	return (
		<QuestGuard
			requiredQuests={QuestID.MysteryChest}
			fallback={
				<>
					<RoughTag
						className="absolute -top-12 left-0 -rotate-6 text-green-800"
						roughConfig={{
							roughness: 1,
							fill: "var(--color-green-200)",
							stroke: "currentColor",
						}}
					>
						Rương bị khoá òiiiii. <br /> Khom bíc là mở kiểu gì nhỉ 🤔?
					</RoughTag>
					<LockIcon className="absolute top-1/3 left-1/2 -translate-x-1/2 z-10 size-24" />
					<PuzzleGame onWin={handleWin} />
				</>
			}
		>
			<RoughBox
				className="size-full"
				backgroundClassName="saturate-50"
				roughConfig={{
					fill: "var(--color-amber-700)",
					stroke: "var(--color-amber-900)",
					strokeWidth: 8,
				}}
			>
				<div className="flex flex-col items-center justify-center h-full text-white text-center text-pretty">
					<p className="mt-4 text-base px-4">
						Chúc mừng em đã giải được câu đố ^^, phần thưởng của em là một chiếc
						chìa khoá nè!!! Hãy rê chuột vào phần thưởng để xem biết nó là gì
						nhaaa.
					</p>

					<HoverTooltip
						content={`Chiếc chìa khoá đặc biệt! Dùng nó để mở khoá tính năng tạo 'khoảng khắc'!`}
						className="text-green-700 font-bold max-w-88"
						roughConfig={{ fill: "var(--color-green-200)" }}
					>
						<div className="p-4 cursor-pointer group">
							<KeyIcon
								className="size-20 drop-shadow-2xl group-hover:drop-shadow-highlight transition-all"
								roughConfig={{
									strokeWidth: 0.5,
									roughness: 0.2,
									stroke: "var(--color-yellow-100)",
									fill: "var(--color-yellow-400)",
									fillStyle: "solid",
								}}
							/>
						</div>
					</HoverTooltip>

					<p className="mt-4 text-base px-4">
						Ngoài ra anh cũng để cho em một chiếc rương ở ngoài màn hình chính,
						chiếc rương này sẽ chứa các vật phẩm đặc biệt mà em tìm kiếm được
						trong quá trình chơi đó!
					</p>
				</div>
			</RoughBox>
		</QuestGuard>
	);
}
