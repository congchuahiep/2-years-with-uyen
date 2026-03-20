"use client";

import {
	type RefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type { Quest, QuestID } from "@/types/quest";

interface PaginationOptions {
	containerRef: RefObject<HTMLDivElement | null>;
	quests: Quest[];
	completedQuests: QuestID[];
	enabled: boolean;
	padding?: number;
}

export type ContentChunk =
	| { type: "title"; questId: QuestID; content: string; isCompleted: boolean }
	| {
			type: "description";
			questId: QuestID;
			content: string;
			isCompleted: boolean;
	  };

export function useContentPagination({
	containerRef,
	quests,
	completedQuests,
	enabled,
	padding = 24,
}: PaginationOptions) {
	const [pages, setPages] = useState<ContentChunk[][]>([]);
	const measureRef = useRef<HTMLDivElement>(null);

	const flatContent = useMemo((): ContentChunk[] => {
		if (!enabled) return [];
		return quests.flatMap((quest) => [
			{
				type: "title",
				questId: quest.id,
				content: quest.title,
				isCompleted: completedQuests.includes(quest.id),
			},
			{
				type: "description",
				questId: quest.id,
				content: quest.description,
				isCompleted: completedQuests.includes(quest.id),
			},
		]);
	}, [quests, completedQuests, enabled]);

	// eslint-disable-next-line react-hooks/preserve-manual-memoization
	const paginate = useCallback(() => {
		const container = containerRef.current;
		const measureNode = measureRef.current;
		if (!container || !measureNode || flatContent.length === 0) {
			setPages([]);
			return;
		}

		const contentToPaginate = [...flatContent];
		const maxHeight = container.clientHeight - padding;
		if (maxHeight <= 0) return;

		const newPages: ContentChunk[][] = [];
		let currentPage: ContentChunk[] = [];
		let currentHeight = 0;

		const tempDiv = document.createElement("div");
		measureNode.appendChild(tempDiv);

		const getChunkHeight = (chunk: ContentChunk): number => {
			if (chunk.type === "title") {
				tempDiv.innerHTML = `<h3 class="text-lg font-bold">${chunk.content}</h3>`;
			} else {
				tempDiv.innerHTML = `<p class="text-gray-700 whitespace-pre-wrap pb-6">${chunk.content}</p>`;
			}
			return tempDiv.getBoundingClientRect().height;
		};

		const findSplitPoint = (
			chunk: ContentChunk,
			availableHeight: number,
		): [string, string] => {
			const text = chunk.content;
			let low = 0;
			let high = text.length;
			let bestFitIndex = 0;

			while (low <= high) {
				const mid = Math.floor((low + high) / 2);
				const subText = text.substring(0, mid);
				const height = getChunkHeight({
					...chunk,
					content: `${subText}...`,
				});

				if (height <= availableHeight) {
					bestFitIndex = mid;
					low = mid + 1;
				} else {
					high = mid - 1;
				}
			}

			const splitIndex = text.substring(0, bestFitIndex).lastIndexOf(" ");
			const finalIndex = splitIndex > 0 ? splitIndex : bestFitIndex;

			if (finalIndex === 0) {
				return ["", text];
			}

			const part1 = `${text.substring(0, finalIndex)}...`;
			const part2 = `...${text.substring(finalIndex).trim()}`;
			return [part1, part2];
		};

		for (let i = 0; i < contentToPaginate.length; i++) {
			const chunk = contentToPaginate[i];
			const chunkHeight = getChunkHeight(chunk);

			if (currentHeight + chunkHeight <= maxHeight) {
				currentPage.push(chunk);
				currentHeight += chunkHeight;
			} else {
				const availableHeight = maxHeight - currentHeight;
				if (availableHeight > 20) {
					const [part1, part2] = findSplitPoint(chunk, availableHeight);

					if (part1) {
						currentPage.push({ ...chunk, content: part1 });
					}

					newPages.push(currentPage);
					currentPage = [];
					currentHeight = 0;

					if (part2) {
						contentToPaginate.splice(i, 1, { ...chunk, content: part2 });
						i--;
					}
				} else {
					newPages.push(currentPage);
					currentPage = [chunk];
					currentHeight = chunkHeight;
				}
			}
		}

		if (currentPage.length > 0) {
			newPages.push(currentPage);
		}

		measureNode.innerHTML = "";
		setPages(newPages);
	}, [containerRef, flatContent, padding]);

	useEffect(() => {
		const observer = new ResizeObserver(() => {
			paginate();
		});

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => {
			observer.disconnect();
		};
	}, [paginate, containerRef]);

	return {
		pages,
		measureRef,
	};
}
