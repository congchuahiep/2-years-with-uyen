import { RoughBox } from "@/components/ui/rough-box";

export function ErrorMessageBox({ children }: { children: React.ReactNode }) {
	return (
		<RoughBox
			className="text-red-500 text-center font-bold"
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
		>
			{children}
		</RoughBox>
	);
}
