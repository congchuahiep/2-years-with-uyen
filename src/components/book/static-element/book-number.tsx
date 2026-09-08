import { cn } from "tailwind-variants";

export function BookNumber({
	pageNumber,
	side,
}: {
	pageNumber: number;
	side: "left" | "right";
}) {
	return (
		<div
			className={cn(
				"pointer-events-none absolute bottom-3 z-10 text-xs font-bold text-blue-700",
				side === "right" ? "right-3" : "left-3",
			)}
		>
			{pageNumber}
		</div>
	);
}
