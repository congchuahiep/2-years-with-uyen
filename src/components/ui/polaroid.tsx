import { RoughBox } from "@/components/ui/rough-box";
import cn from "@/utils/cn";

export function Polaroid({
	className,
	isLandscape = false,
	style,
	children,
	text,
	isMini,
}: {
	isMini?: boolean;
	className?: string;
	isLandscape?: boolean;
	style?: React.CSSProperties;
	text?: string;
	children?: React.ReactNode;
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
				"shadow-md mix-blend-normal transition-all duration-300 relative",
				isLandscape
					? isMini
						? "w-32 md:w-40 aspect-4/3"
						: "w-60 md:w-75 aspect-4/3"
					: isMini
						? "w-34 md:w-40 aspect-3/4"
						: "w-40 md:w-55 aspect-3/4",
				className,
			)}
			style={style}
		>
			<div
				className={cn(
					"relative mb-10 scale-90",
					isLandscape ? "h-full w-[90%]" : "h-[90%] w-full",
				)}
			>
				{children}
				<div
					className={cn(
						"px-1 font-bold line-clamp-1 text-xs",
						isMini ? "-mt-1" : "",
					)}
				>
					{text}
				</div>
			</div>
		</RoughBox>
	);
}
