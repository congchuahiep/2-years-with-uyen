"use client";

import {
	autoUpdate,
	FloatingPortal,
	flip,
	offset,
	shift,
	useClientPoint,
	useDismiss,
	useFloating,
	useFocus,
	useHover,
	useInteractions,
	useRole,
} from "@floating-ui/react";
import { type ReactNode, useMemo, useState } from "react";
import type { Options } from "roughjs/bin/core";
import type { FillStyle } from "@/types/rough";
import { RoughBox } from "./rough-box";
import cn from "@/utils/cn";

interface HoverTooltipProps {
	children: ReactNode;
	content: ReactNode;
	placement?: "top" | "bottom" | "left" | "right";
	offsetValue?: number;
	roughConfig?: Options & { fillStyle?: FillStyle };
	className?: string;
	containerClassName?: string;
}

export function HoverTooltip({
	children,
	content,
	placement = "top",
	offsetValue = 8,
	roughConfig = {},
	className,
	containerClassName,
}: HoverTooltipProps) {
	const [isOpen, setIsOpen] = useState(false);

	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement,
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(offsetValue),
			flip({ fallbackAxisSideDirection: "start" }),
			shift({ padding: 5 }),
		],
	});

	const hover = useHover(context, { move: true, delay: { open: 100 } });
	const focus = useFocus(context);
	const dismiss = useDismiss(context);
	const role = useRole(context, { role: "tooltip" });
	const clientPoint = useClientPoint(context, {
		axis: "x",
	});

	const { getReferenceProps, getFloatingProps } = useInteractions([
		hover,
		focus,
		dismiss,
		role,
		clientPoint,
	]);

	const referenceProps = useMemo(
		() => getReferenceProps(),
		[getReferenceProps],
	);
	const floatingProps = useMemo(() => getFloatingProps(), [getFloatingProps]);

	return (
		<>
			<span ref={refs.setReference} {...referenceProps}>
				{children}
			</span>
			<FloatingPortal>
				{isOpen && (
					<RoughBox
						// eslint-disable-next-line react-hooks/refs
						ref={refs.setFloating}
						style={floatingStyles}
						roughConfig={{
							stroke: "currentColor",
							fill: "var(--color-yellow-50)",
							...roughConfig,
						}}
						className={cn(
							"z-50 rounded-md text-sm text-white shadow-lg w-fit",
							className,
						)}
						containerClassName={containerClassName}
						{...floatingProps}
					>
						{content}
					</RoughBox>
				)}
			</FloatingPortal>
		</>
	);
}
