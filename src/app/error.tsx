"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RoughBox } from "@/components/ui/rough-box";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Ghi log lỗi ra một dịch vụ báo cáo lỗi
		console.error(error);
	}, [error]);

	return (
		<main className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-md text-center">
				<RoughBox
					roughConfig={{
						bowing: 2,
						roughness: 3,
						stroke: "var(--color-red-500)",
						strokeWidth: 3,
						fillStyle: "cross-hatch",
						fill: "var(--color-red-100)",
						fillWeight: 16,
						strokeLineDash: [8, 4],
					}}
					padding={32}
				>
					<div className="space-y-4 text-red-700">
						<h2 className="text-2xl font-bold font-display">
							Ối, có lỗi xảy ra!
						</h2>
						<p>{error.message || "Đã có lỗi không mong muốn xảy ra."}</p>
						<Button
							onClick={
								// Cố gắng khôi phục bằng cách thử render lại route
								() => reset()
							}
							className="mt-4"
							fill="var(--color-red-500)"
						>
							Thử lại
						</Button>
					</div>
				</RoughBox>
			</div>
		</main>
	);
}
