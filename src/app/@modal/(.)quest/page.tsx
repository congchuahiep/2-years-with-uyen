"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuestView } from "@/app/quest/view";
import { Modal } from "@/components/ui/modal";
import cn from "@/utils/cn";

export default function QuestModalPage() {
	const router = useRouter();
	const [isModalVisible, setIsModalVisible] = useState(true);

	const handleClose = () => {
		setIsModalVisible(false);
		setTimeout(() => router.back(), 300);
	};

	return (
		<Modal isOpen={isModalVisible} onClose={handleClose}>
			<motion.div
				initial={{ y: 50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: 50, opacity: 0 }}
				transition={{ type: "spring", bounce: 0, duration: 0.3 }}
				className={cn(
					"w-full max-w-md",
					"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
				)}
			>
				<QuestView />
			</motion.div>
		</Modal>
	);
}
