import { RoughBox } from "@/components/ui/rough-box";
import cn from "@/utils/cn";

export function ErrorMessageBox({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<RoughBox
			className={cn("text-red-500 text-center font-bold text-wrap", className)}
			roughConfig={{
				fill: "var(--color-red-200)",
				fillStyle: "zigzag",
				fillWeight: 4,
				stroke: "var(--color-red-500)",
				strokeLineDash: [5, 10],
				strokeLineDashOffset: 5,
				roughness: 2,
				bowing: 0,
			}}
			padding={8}
		>
			{children}
		</RoughBox>
	);
}
