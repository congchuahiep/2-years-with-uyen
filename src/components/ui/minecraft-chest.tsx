import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { playSound } from "@/utils/audio";
import cn from "@/utils/cn";
import { Modal } from "./modal";
import { RoughBox } from "./rough-box";

export default function MinecraftChest({
	className,
	children,
	...props
}: React.RefAttributes<HTMLImageElement | null> & {
	className?: string;
	isOpen?: boolean;
	onClick?: () => void;
	children?: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	const handleOnClick = () => {
		setIsOpen(!isOpen);
		if (isOpen) playSound("chestClose");
		else playSound("chestOpen");
	};

	return (
		<>
			<Image
				{...props}
				src={isOpen ? "/chest-open.png" : "/chest.png"}
				alt="Mystery Chest"
				width={200}
				height={200}
				className={cn(className)}
				onClick={handleOnClick}
			/>
			<Modal isOpen={isOpen} onClose={handleOnClick}>
				<motion.div
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 50, opacity: 0 }}
					transition={{ type: "spring", bounce: 0, duration: 0.3 }}
					className={cn(
						"w-full max-w-3xl aspect-square",
						"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
					)}
				>
					<RoughBox
						className="h-full"
						padding={64}
						backgroundClassName="saturate-50"
						roughConfig={{
							roughness: 4,
							strokeWidth: 8,
							stroke: "var(--color-amber-900)",
							fill: "var(--color-amber-600)",
							fillStyle: "zigzag",
							fillWeight: 28,
						}}
					>
						{children}
					</RoughBox>
				</motion.div>
			</Modal>
		</>
	);
}
