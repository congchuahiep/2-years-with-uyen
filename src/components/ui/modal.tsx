"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useModal } from "@/providers/modal-provider";
import cn from "@/utils/cn";

interface ModalProps {
	children: React.ReactNode;
	isOpen?: boolean;
	onClose?: () => void;
}

export function Modal({ children, isOpen = false, onClose }: ModalProps) {
	const [mounted, setMounted] = useState(false);
	const { registerModal, unregisterModal } = useModal();

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!isOpen) return;
		registerModal();

		return () => {
			unregisterModal();
		};
	}, [isOpen, registerModal, unregisterModal]);

	const handleDialogClose = () => {
		if (onClose) onClose();
	};

	if (!mounted) return null;

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<div className="bg-transparent">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						onClick={handleDialogClose}
						className={cn("bg-black/50 fixed inset-0")}
					/>

					{/*<motion.div
						initial={{ y: 50, opacity: 0, zIndex: 100 }}
						animate={{ y: 0, opacity: 1, zIndex: 100 }}
						exit={{ y: 50, opacity: 0 }}
						transition={{ type: "spring", bounce: 0, duration: 0.3 }}
						className={cn(
							"fixed z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
						)}
					></motion.div>*/}
					{children}
				</div>
			)}
		</AnimatePresence>,
		document.body,
	);
}
