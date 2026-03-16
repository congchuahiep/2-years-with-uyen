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
				<h1 className="text-4xl font-bold text-gray-800">
					Welcome to Our Scrapbook
				</h1>
				<p className="mt-4 text-lg text-gray-600">
					A collection of our moments, two years and counting.
				</p>
			</div>
		</div>
	);
}
