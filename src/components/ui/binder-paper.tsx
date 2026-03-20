import { forwardRef } from "react";
import cn from "@/utils/cn";

interface BinderPaperProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
	className?: string;
	containerClassName?: string;
}

export const BinderPaper = forwardRef<HTMLDivElement, BinderPaperProps>(
	({ children, className, containerClassName, ...props }, ref) => {
		return (
			<div
				ref={ref} // Gắn ref vào đây
				className={cn(
					"relative drop-shadow-md transition-all duration-300 flex flex-col items-stretch",
					className,
				)}
				{...props}
			>
				<div
					className={cn(
						"flex-1 rounded-md border border-border bg-background relative overflow-visible",
						"bg-[radial-gradient(circle,var(--color-primary)_0.75px,transparent_0.8px)]",
						"bg-size-[24px_24px]", // Size for dots
					)}
					style={{
						WebkitMaskImage:
							"radial-gradient(circle at 20px 24px, transparent 6px, black 6.5px)",
						WebkitMaskSize: "100% 48px",
						maskImage:
							"radial-gradient(circle at 20px 24px, transparent 8px, black 8px)",
						maskSize: "100% 48px",
					}}
				>
					<div className="absolute left-14 top-0 bottom-0 w-0.5 bg-red-400 z-0" />
					<div className="absolute left-15 top-0 bottom-0 w-0.5 bg-red-400 z-0" />
				</div>
				<div
					className={cn(
						"md:pl-19 p-4 pt-4.5 h-full absolute inset-0",
						containerClassName,
					)}
				>
					{children}
				</div>
			</div>
		);
	},
);

BinderPaper.displayName = "BinderPaper";
