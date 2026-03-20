import cn from "@/utils/cn";

export function HeroSection({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"h-screen bg-white relative shadow-2xl",
				"flex items-center justify-center",
				className,
			)}
		>
			<div className="text-center">
				<h1 className="text-4xl font-bold text-gray-800">U + H</h1>
				<p className="mt-4 text-lg text-gray-600">
					Một bộ sưu tập các &quot;khoảng khắc&quot; của đôi ta. Hai năm và đang
					viết tiếp!
				</p>
			</div>
		</div>
	);
}
