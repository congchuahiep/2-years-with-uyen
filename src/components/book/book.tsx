"use client";

import { type ReactNode, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { cn } from "tailwind-variants";
import { ArrowIcon } from "@/components/icon/arrow";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import type { BookPairFlipPage } from "@/types/flipbook";
import { BlankBookPage } from "./blank-book-page";
import { BookCover } from "./book-cover";
import { BookPage } from "./book-page";
import { EndBookPage } from "./static-element/end-book-page";
import { FrontBookCover } from "./static-element/front-book-cover";
import { TitleBookPage } from "./static-element/title-book-page";

/**
 * ! THỨ TỰ MẶT TRANG
 * Đúng (mặc định): mỗi cặp trang emit theo thứ tự (mặt TRÁI, mặt PHẢI).
 * Nếu chạy thử thấy các mặt bị NGƯỢC (mặt trái ra bên phải) — hãy đổi thành
 * `false` và chỉ cần swap 2 dòng trong `buildPages` bên dưới.
 */
const LEFT_PAGE_FIRST = true;

type FlipBookControl = {
	flipNext: (corner?: "top" | "bottom") => void;
	flipPrev: (corner?: "top" | "bottom") => void;
	turnToPage: (page: number) => void;
	getPageCount: () => number;
};

interface BookProps {
	pages: BookPairFlipPage[];
}

export function Book({ pages }: BookProps) {
	const flipBookRef = useRef<{ pageFlip: () => FlipBookControl | undefined }>(
		null,
	);
	const [currentPage, setCurrentPage] = useState(0);

	const handleNext = () => flipBookRef.current?.pageFlip()?.flipNext("bottom");
	const handlePrev = () => flipBookRef.current?.pageFlip()?.flipPrev("top");

	const pageChildren = buildPages(pages);

	const handleBookState = ({
		data: event,
	}: {
		data: "user_fold" | "fold_corner" | "flipping" | "read";
	}) => {
		console.log(event);

		switch (event) {
			case "fold_corner": {
				document.body.style.cursor = "grab";
				const releaseMouse = () => {
					document.body.style.cursor = "grab";
					window.removeEventListener("mouseup", releaseMouse);
				};
				const grabMouse = () => {
					document.body.style.cursor = "grabbing";
					window.removeEventListener("mousedown", grabMouse);
					window.addEventListener("mouseup", releaseMouse);
				};
				window.addEventListener("mousedown", grabMouse);
				return;
			}
			case "user_fold": {
				document.body.style.cursor = "grabbing";
				const releaseMouse = () => {
					document.body.style.cursor = "initial";
					window.removeEventListener("mouseup", releaseMouse);
				};
				window.addEventListener("mouseup", releaseMouse);
				return;
			}
			case "read":
				document.body.style.cursor = "initial";
				return;
		}
	};

	return (
		<div className="flex w-full flex-col items-center gap-6">
			<div className="w-full drop-shadow-2xl z-50 relative">
				<HTMLFlipBook
					ref={flipBookRef}
					width={520}
					height={650}
          size="stretch"
          minWidth={300}
					maxWidth={520}
					minHeight={420}
					maxHeight={650}
					drawShadow
					flippingTime={500}
					usePortrait
					startZIndex={50}
					autoSize={true}
					maxShadowOpacity={0.35}
					showCover={true}
					mobileScrollSupport
					clickEventForward
					useMouseEvents
					swipeDistance={30}
					showPageCorners={true}
					disableFlipByClick
					startPage={0}
					className="mx-auto"
					style={{ transition: "all 0s ease" }}
					onFlip={(event) => {
						setCurrentPage(event.data as number);
					}}
					onChangeState={handleBookState}
				>
					{pageChildren}
				</HTMLFlipBook>

				<GhostBookDepth
					currentPage={currentPage}
					totalPages={pageChildren.length}
				/>
			</div>

			{/* Bộ điều khiển */}
			<div className="flex items-center gap-4 z-10">
				<Button
					perspective="right"
					buttonSize="small"
					fill="var(--color-yellow-300)"
					onClick={handlePrev}
					disabled={currentPage <= 0}
				>
					<ArrowIcon variant="thick" className="rotate-180 scale-150" />
				</Button>
				<span className="min-w-28 text-center text-sm font-bold text-purple-100">
					Trang {currentPage + 1}/{pageChildren.length}
				</span>
				<Button
					perspective="left"
					buttonSize="small"
					fill="var(--color-yellow-300)"
					onClick={handleNext}
				>
					<ArrowIcon variant="thick" className="scale-150" />
				</Button>
			</div>

			<p className="text-xs font-semibold text-purple-200/70 select-none">
				💡 Kéo ở mép / góc trang để lật theo tay — hoặc dùng nút ◀ ▶
			</p>
		</div>
	);
}

function GhostBookDepth({
	currentPage,
	totalPages,
}: {
	currentPage: number;
	totalPages: number;
}) {
	return (
		<div className="absolute inset-0 size-full grid grid-cols-2 -z-50">
			<BookCover
				key="ghost-cover-front"
				side="left"
				className={cn(
					"transition-opacity duration-500",
					currentPage >= 3 ? "opacity-100" : "opacity-0",
				)}
			/>
			<BookCover
				key="ghost-cover-back"
				side="right"
				className={cn(
					"transition-opacity duration-500",
					currentPage <= totalPages - 5 ? "opacity-100" : "opacity-0",
				)}
			/>
		</div>
	);
}

/**
 * Dựng danh sách child cho HTMLFlipBook từ dữ liệu PairFlipPage.
 * Thứ tự:
 * - Bìa trước
 * - Mặt sau bìa trước
 * - Tiêu đề
 * - Danh sách các cặp trang (trái, phải)...
 * - Kết thúc
 * - Mặt sau bìa sau
 * - Bìa sau
 *
 * Số trang vật lý: bìa=-1, gian=0, tiêu đề=1, cặp moment đầu = (2,3), ...
 */
function buildPages(pages: BookPairFlipPage[]): ReactNode[] {
	const faces: ReactNode[] = [];

	for (const [index, pair] of pages.entries()) {
		// Số trang vật lý: tiêu đề = 1 nên cặp moment thứ i là (2+2i, 3+2i)
		const left = (
			<BookPage
				key={`${pair.id}-left`}
				side="left"
				pageNumber={index * 2 + 2}
				items={pair.items.filter((item) => item.side === "left")}
			/>
		);
		const right = (
			<BookPage
				key={`${pair.id}-right`}
				side="right"
				pageNumber={index * 2 + 3}
				items={pair.items.filter((item) => item.side === "right")}
			/>
		);

		faces.push(LEFT_PAGE_FIRST ? left : right);
		faces.push(LEFT_PAGE_FIRST ? right : left);
	}

	return [
		<FrontBookCover key="front-cover" />,
		<BookCover key="flyleaf" side="left" />,
		<TitleBookPage key="title-page" />,
		...faces,
		...Array.from({ length: 10 }).map((_, i) => {
			const isLeft = i % 2 === 0;
			return (
				<BlankBookPage key={`blank-${i}`} side={isLeft ? "left" : "right"} />
			);
		}),
		<EndBookPage key="end-message" />,
		<BookCover key="end-blank" side="right" />,
		<BookCover key="back-cover" />,
	];
}
