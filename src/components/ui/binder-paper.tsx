import cn from "@/utils/cn";

interface BinderPaperProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export function BinderPaper({
	children,
	className,
	...props
}: BinderPaperProps) {
	return (
		<div
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
			<div className="md:pl-16 sm:pl-14 pl-14 p-4 h-full absolute inset-0">
				{children}
			</div>
		</div>
	);
}
