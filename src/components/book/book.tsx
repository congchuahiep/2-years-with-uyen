"use client";

import {
	type ReactNode,
	type RefObject,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import HTMLFlipBook from "react-pageflip";
import { cn } from "tailwind-variants";
import { ArrowIcon } from "@/components/icon/arrow";
import { Button } from "@/components/ui/button";
import type { BookPairFlipPage } from "@/types/flipbook";
import { BlankBookPage } from "./blank-book-page";
import { BookCover } from "./book-cover";
import { BookPage } from "./book-page";
import {
	BOOK_PAGE_DESIGN_HEIGHT,
	BOOK_PAGE_DESIGN_WIDTH,
	BookPageScale,
} from "./book-page-scale";
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

/**
 * Ngưỡng chuyển chế độ hiển thị:
 * - Chiều rộng trình duyệt > 1024px (xấp xỉ giới hạn `max-w-5xl` của layout) → mở 2 trang
 * - Chiều rộng trình duyệt <= 1024px → hiển thị 1 trang (portrait)
 */
const PORTRAIT_BREAKPOINT = 1024;

/** Trì hoãn đo lại kích thước khi đang kéo resize, tránh việc remount cuốn sổ liên tục */
const LAYOUT_DEBOUNCE_MS = 150;

/**
 * Kích thước tính được cho cuốn sổ.
 * `width`/`height` là kích thước của MỘT mặt trang sau khi đã co theo container.
 */
interface BookLayout {
	/** true = 1 trang, false = mở 2 trang */
	portrait: boolean;
	width: number;
	height: number;
	/** Tỉ lệ thu/phóng nội dung so với thiết kế 520×650 */
	scale: number;
}

const INITIAL_LAYOUT: BookLayout = {
	portrait: false,
	width: BOOK_PAGE_DESIGN_WIDTH,
	height: BOOK_PAGE_DESIGN_HEIGHT,
	scale: 1,
};

/**
 * Đo chiều rộng container + viewport để tính kích thước & chế độ hiển thị của sổ.
 *
 * Kích thước luôn được tính sao cho cuốn sổ vừa khít container:
 * - chế độ 2 trang: mỗi trang = min(520, container / 2)
 * - chế độ 1 trang: mỗi trang = min(520, container)
 * và chiều cao giữ nguyên tỉ lệ 520:650 (nội dung bên trong tự scale theo,
 * xem `BookPageScale`). Như vậy sổ không bao giờ tràn container.
 */
function useBookLayout(
	containerRef: RefObject<HTMLDivElement | null>,
): BookLayout {
	const [layout, setLayout] = useState<BookLayout>(INITIAL_LAYOUT);

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		let timer: number | undefined;

		const measure = () => {
			const viewportWidth = window.innerWidth;
			const containerWidth = container.clientWidth;

			const portrait = viewportWidth <= PORTRAIT_BREAKPOINT;
			const width = Math.min(
				BOOK_PAGE_DESIGN_WIDTH,
				Math.max(portrait ? containerWidth : containerWidth / 2, 0),
			);
			const scale = width / BOOK_PAGE_DESIGN_WIDTH;
			const height = BOOK_PAGE_DESIGN_HEIGHT * scale;

			setLayout((previous) =>
				previous.portrait === portrait &&
				Math.abs(previous.width - width) < 0.5 &&
				Math.abs(previous.height - height) < 0.5
					? previous
					: { portrait, width, height, scale },
			);
		};

		const scheduleMeasure = () => {
			if (timer) window.clearTimeout(timer);
			timer = window.setTimeout(measure, LAYOUT_DEBOUNCE_MS);
		};

		measure();

		const observer = new ResizeObserver(scheduleMeasure);
		observer.observe(container);

		return () => {
			observer.disconnect();
			if (timer) window.clearTimeout(timer);
		};
	}, [containerRef]);

	return layout;
}

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
	const containerRef = useRef<HTMLDivElement>(null);
	const flipBookRef = useRef<{ pageFlip: () => FlipBookControl | undefined }>(
		null,
	);
	const [currentPage, setCurrentPage] = useState(0);
	const previousPortrait = useRef(INITIAL_LAYOUT.portrait);

	const layout = useBookLayout(containerRef);

	// Ở 2 chế độ, StPageFlip đánh số trang khác nhau → khi chuyển chế độ 2 trang ↔ 1
	// trang thì quay về trang bìa cho chắc chắn (chạy trước paint, trước khi
	// HTMLFlipBook được remount với `startPage` mới).
	useLayoutEffect(() => {
		if (previousPortrait.current !== layout.portrait) {
			previousPortrait.current = layout.portrait;
			setCurrentPage(0);
		}
	}, [layout.portrait]);

	const handleNext = () => flipBookRef.current?.pageFlip()?.flipNext("bottom");
	const handlePrev = () => flipBookRef.current?.pageFlip()?.flipPrev("top");

	const pageChildren = useMemo(() => buildPages(pages), [pages]);

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
		<div ref={containerRef} className="flex w-full flex-col items-center gap-6">
			<div
				className="w-full drop-shadow-2xl z-50 relative"
				style={layout.portrait ? { width: layout.width } : undefined}
			>
				<HTMLFlipBook
					key={`${layout.portrait ? "portrait" : "landscape"}-${Math.round(layout.width)}-${Math.round(layout.height)}`}
					ref={flipBookRef}
					width={layout.width}
					height={layout.height}
					size="fixed"
					minWidth={layout.width}
					maxWidth={layout.width}
					minHeight={layout.height}
					maxHeight={layout.height}
					startPage={currentPage}
					usePortrait={layout.portrait}
					autoSize
					drawShadow
					flippingTime={500}
					startZIndex={50}
					maxShadowOpacity={0.35}
					showCover={true}
					mobileScrollSupport
					clickEventForward
					useMouseEvents
					swipeDistance={30}
					showPageCorners={true}
					disableFlipByClick
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
					layout={layout}
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
	layout,
	currentPage,
	totalPages,
}: {
	layout: BookLayout;
	currentPage: number;
	totalPages: number;
}) {
	return (
		<div
			className={cn(
				"absolute inset-0 size-full grid -z-50",
				!layout.portrait && "grid-cols-2",
			)}
		>
			{!layout.portrait ? (
				<>
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
				</>
			) : (
				<BookCover
					key="ghost-cover"
					className={cn(
						"transition-opacity duration-500",
						currentPage >= 2 ? "opacity-100" : "opacity-0",
					)}
				/>
			)}
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
				side="left"
				pageNumber={index * 2 + 2}
				items={pair.items.filter((item) => item.side === "left")}
			/>
		);
		const right = (
			<BookPage
				side="right"
				pageNumber={index * 2 + 3}
				items={pair.items.filter((item) => item.side === "right")}
			/>
		);

		faces.push(
			<BookPageScale key={`${pair.id}-left`}>
				{LEFT_PAGE_FIRST ? left : right}
			</BookPageScale>,
		);
		faces.push(
			<BookPageScale key={`${pair.id}-right`}>
				{LEFT_PAGE_FIRST ? right : left}
			</BookPageScale>,
		);
	}

	const blankPages: ReactNode[] = [];
	for (let index = 0; index < 10; index += 1) {
		const isLeft = index % 2 === 0;
		blankPages.push(
			<BookPageScale key={`blank-${index}`}>
				<BlankBookPage side={isLeft ? "left" : "right"} />
			</BookPageScale>,
		);
	}

	return [
		<BookPageScale key="front-cover">
			<FrontBookCover key="front-cover" />
		</BookPageScale>,
		<BookPageScale key="flyleaf">
			<BookCover side="left" />
		</BookPageScale>,
		<BookPageScale key="title-page">
			<TitleBookPage />
		</BookPageScale>,
		...faces,
		...blankPages,
		<BookPageScale key="end-message">
			<EndBookPage />
		</BookPageScale>,
		<BookPageScale key="end-blank">
			<BookCover side="right" />
		</BookPageScale>,
		<BookPageScale key="back-cover">
			<BookCover />
		</BookPageScale>,
	];
}
