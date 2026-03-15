"use client";

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import cn from "@/utils/cn";

interface ModalContextType {
	registerModal: () => void;
	unregisterModal: () => void;
	isAnyModalOpen: boolean;
	scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error("useModal must be used within a ModalProvider");
	}
	return context;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
	const [modalCount, setModalCount] = useState(0);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const registerModal = useCallback(
		() => setModalCount((prev) => prev + 1),
		[],
	);
	const unregisterModal = useCallback(
		() => setModalCount((prev) => Math.max(0, prev - 1)),
		[],
	);

	const isAnyModalOpen = modalCount > 0;

	const value = useMemo(
		() => ({
			registerModal,
			unregisterModal,
			isAnyModalOpen,
			scrollContainerRef,
		}),
		[isAnyModalOpen, registerModal, unregisterModal],
	);

	return (
		<ModalContext.Provider value={value}>{children}</ModalContext.Provider>
	);
}

export function ModalContentWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAnyModalOpen, scrollContainerRef } = useModal();

	return (
		<div
			className={cn(
				"h-screen max-h-screen overflow-hidden origin-top",
				"shadow-[0_0_50px_0px_rgba(0,0,0,0.5) relative z-0",
				"transition-all duration-300 ease-out",
				isAnyModalOpen &&
					"scale-[0.9] translate-y-10 opacity-[0.6] rounded-3xl",
			)}
		>
			<div
				id="root"
				className="h-screen overflow-y-scroll overflow-x-hidden bg-bg"
				ref={scrollContainerRef}
			>
				{children}
			</div>
		</div>
	);
}
