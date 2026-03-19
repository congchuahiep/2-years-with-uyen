"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditProfileView from "@/app/profile/edit/view";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { useUserProfile } from "@/hooks/use-user-profile";
import cn from "@/utils/cn";

export default function EditProfileModalPage() {
	const router = useRouter();
	const { data, isFetching, error } = useUserProfile();
	const profile = data ? data : null;

	const [isModalVisible, setIsModalVisible] = useState(true);

	if (error) throw error;

	const handleClose = () => {
		setIsModalVisible(false);
		setTimeout(() => router.back(), 300);
	};

	return (
		<Modal isOpen={isModalVisible} onClose={handleClose}>
			{isFetching ? (
				<div
					className={cn(
						"flex items-center justify-center gap-2",
						"text-white font-bold text-xl",
					)}
				>
					<Spinner className="size-12" />
					Loading...
				</div>
			) : (
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
					<EditProfileView profile={profile} />
				</motion.div>
			)}
		</Modal>
	);
}
