"use client";

import { useSafeBack } from "@/hooks/use-safe-back";
import { DoorOutIcon } from "./icon/door-out";
import { Button } from "./ui/button";

export function BackButton({ children }: { children?: React.ReactNode }) {
	const safeBack = useSafeBack();

	return (
		<Button
			onClick={() => safeBack()}
			fill="var(--color-red-300)"
			perspective="right"
			buttonSize="small"
			className="absolute top-4 left-4 z-10"
		>
			<DoorOutIcon className="size-5" />
			{children || "Quay lại"}
		</Button>
	);
}
