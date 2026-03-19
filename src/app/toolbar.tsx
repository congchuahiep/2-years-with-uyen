"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { LockIcon } from "@/components/icon/lock-icon";
import { PencilIcon } from "@/components/icon/pencil";
import { QuestIcon } from "@/components/icon/quest";
import { UserIcon } from "@/components/icon/user-icon";
import { QuestGuard } from "@/components/quest-guard";
import Float from "@/components/ui/float";
import { RoughBox } from "@/components/ui/rough-box";
import { RoughTag } from "@/components/ui/rough-tag";
import { route } from "@/configs/route";
import { QuestID } from "@/types/quest";
import { playSound } from "@/utils/audio";
import cn from "@/utils/cn";

export function HomeToolbar() {
	return (
		<>
			<QuestTool className="fixed bottom-6 right-100 z-0" />

			<UserProfileTool className="fixed bottom-12 right-64 z-0" />

			<QuestGuard
				requiredQuests={QuestID.PersonalizeProfile}
				fallback={
					<NewMomentTool isLocked className="fixed bottom-6 right-12 z-0" />
				}
			>
				<NewMomentTool className="fixed bottom-6 right-12 z-0" />
			</QuestGuard>
		</>
	);
}

function QuestTool({ className }: { className?: string }) {
	return (
		<Link
			href={route.quest}
			className={cn(
				"transition-all ease-out drop-shadow-xl",
				"hover:scale-105 active:scale-95 hover:drop-shadow-highlight",
				className,
			)}
		>
			<Float
				speed={0.2}
				amplitude={[10, 10, 10]}
				rotationRange={[7.5, 7.5, 5]}
				timeOffset={12}
			>
				<motion.div
					initial={{ y: 40, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 40, opacity: 0 }}
					transition={{ type: "spring", duration: 0.3 }}
					className="relative"
				>
					<QuestIcon className="h-40 w-auto" />
				</motion.div>
			</Float>
		</Link>
	);
}

function UserProfileTool({ className }: { className?: string }) {
	return (
		<Link
			href={route.profile.edit}
			className={cn(
				"transition-all ease-out drop-shadow-xl",
				"hover:scale-105 active:scale-95 hover:drop-shadow-highlight",
				className,
			)}
		>
			<Float
				speed={0.2}
				amplitude={[10, 10, 10]}
				rotationRange={[7.5, 7.5, 5]}
				timeOffset={5}
			>
				<motion.div
					initial={{ y: 40, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 40, opacity: 0 }}
					transition={{ type: "spring", duration: 0.3 }}
					className="relative"
				>
					<RoughTag
						className="h-24 w-36 rotate-90"
						roughConfig={{
							roughness: 0.5,
							fill: "var(--color-green-100)",
							stroke: "var(--color-green-700)",
						}}
					>
						<div className="absolute -rotate-90 text-green-700 flex flex-col items-center gap-1">
							<UserIcon
								className="size-16"
								roughConfig={{
									roughness: 0,
									stroke: "transparent",
									fill: "var(--color-green-700)",
									fillStyle: "solid",
								}}
							/>
							Tài khoản
						</div>
					</RoughTag>
				</motion.div>
			</Float>
		</Link>
	);
}

function NewMomentTool({
	isLocked,
	className,
}: {
	isLocked?: boolean;
	className?: string;
}) {
	return (
		<Link
			href={route.moments.create}
			className={cn(
				"transition-all ease-out drop-shadow-xl",
				"active:scale-95 hover:drop-shadow-highlight hover:scale-105",
				isLocked && "pointer-events-none",
				className,
			)}
			onClick={() => playSound()}
			aria-disabled={isLocked}
		>
			<Float speed={0.2} amplitude={[10, 10, 10]} rotationRange={[7.5, 7.5, 5]}>
				<motion.div
					initial={{ y: 40, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 40, opacity: 0 }}
					transition={{ type: "spring", duration: 0.3, delay: 0.1 }}
					className="relative"
				>
					{isLocked && (
						<LockIcon
							className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
							roughConfig={{
								roughness: 0.5,
								strokeWidth: 1,
								stroke: "var(--color-slate-700)",
								fill: "var(--color-slate-200)",
								fillStyle: "solid",
							}}
						/>
					)}

					<RoughBox
						className={cn("w-40 h-50", isLocked && "brightness-50 opacity-70")}
						roughConfig={{
							fill: "var(--color-yellow-100)",
							stroke: "var(--color-yellow-900)",
						}}
					>
						<span className="pt-2 text-yellow-900">
							~~~~~~~~~~ ~~ ~~~~~~~ ~~~~~~ ~~~~~ ~~~~~~ ~~~~~~ ~~~~ ~~
						</span>
					</RoughBox>

					<motion.div
						animate={
							isLocked
								? false
								: {
										x: [0, -50, -15, 0, 25, 40, 60, 0],
										y: [0, -20, 5, 15, 0, -40, 10, 0],
										rotate: [0, 8, -3, 15, -8, 3, -7, 0],
									}
						}
						transition={{
							duration: 1,
							repeatDelay: 2,
							repeat: Infinity,
						}}
						className={cn(
							"absolute -bottom-12 right-4 z-10",
							isLocked && "brightness-50 opacity-70",
						)}
					>
						<PencilIcon
							className="h-48 -rotate-45"
							roughConfig={{
								fill: "var(--color-amber-300)",
								fillWeight: 3,
								fillStyle: "zigzag",
								roughness: 0.8,
							}}
						/>
					</motion.div>
					<RoughTag
						className={cn(
							"absolute top-16 -left-10 -rotate-12 w-39",
							isLocked && "brightness-50 opacity-70",
						)}
						roughConfig={{ fill: "var(--color-red-300)", roughness: 0.5 }}
					>
						Tạo kỉ niệm
					</RoughTag>
				</motion.div>
			</Float>
		</Link>
	);
}
