import cn from "@/utils/cn";
import { RoughBox } from "./rough-box";

export function Input({
	className,
	...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<RoughBox padding={0} roughConfig={{ roughness: 0.8, strokeWidth: 2 }}>
			<div className="p-3">
				<input
					{...props}
					className={cn(
						"w-full bg-transparent text-lg outline-none transition-all",
						"placeholder:text-foreground/50 px-1",
						className,
					)}
				/>
			</div>
		</RoughBox>
	);
}
