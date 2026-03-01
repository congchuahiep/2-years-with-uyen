import { RoughBox } from "@/components/ui/rough-box";
import cn from "@/utils/cn";

export function Polaroid({
	className,
	isLandscape = false,
	children,
}: {
	className?: string;
	isLandscape?: boolean;
	children: React.ReactNode;
}) {
	return (
		<RoughBox
			padding={0}
			roughConfig={{
				roughness: 1.5,
				strokeWidth: 1.5,
				fill: "white",
				fillStyle: "solid",
			}}
			className={cn(
				"shadow-xl mix-blend-normal transition-all duration-300",
				isLandscape
					? "w-[240px] md:w-[300px] aspect-4/3"
					: "w-[160px] md:w-[220px] aspect-3/4",
				className,
			)}
		>
			<div
				className={cn(
					"relative mb-10 scale-90",
					isLandscape ? "h-full w-[90%]" : "h-[90%] w-full",
				)}
			>
				{children}
			</div>
		</RoughBox>
	);
}
