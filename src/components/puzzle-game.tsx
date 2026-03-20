"use client";

import {
	DndContext,
	type DragEndEvent,
	useDraggable,
	useDroppable,
} from "@dnd-kit/core";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { playSound } from "@/utils/audio";
import cn from "@/utils/cn";

import { RoughBox } from "./ui/rough-box";

type Piece = {
	id: number;
	image: string;
};

const PIECES: Piece[] = [
	{ id: 1, image: "/camera.webp" },
	{ id: 2, image: "/mail.webp" },
	{ id: 3, image: "/tripod-no.webp" },
	{ id: 4, image: "/statue.webp" },
	{ id: 5, image: "/lego.webp" },
	{ id: 6, image: "/house.webp" },
];

function DraggablePiece({ piece }: { piece: Piece }) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: piece.id.toString(),
	});
	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
				zIndex: 50,
			}
		: undefined;

	return (
		<button
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			type="button"
			className={cn(
				"flex items-center justify-center",
				"size-22 touch-none text-4xl font-bold",
				"cursor-grab active:cursor-grabbing active:size-32",
			)}
		>
			<RoughBox
				className="size-full overflow-hidden text-neutral-700"
				roughConfig={{
					fill: "var(--color-neutral-300)",
					stroke: "currentColor",
				}}
			>
				<Image
					src={piece.image}
					alt={piece.id.toString()}
					fill
					sizes="80px"
					className="object-cover"
				/>
			</RoughBox>
		</button>
	);
}

function DroppableSlot({
	id,
	children,
}: {
	id: string;
	children: React.ReactNode;
}) {
	const { isOver, setNodeRef } = useDroppable({ id });

	return (
		<div
			ref={setNodeRef}
			className={cn(
				"size-24 text-amber-900 rounded-lg transition-colors",
				isOver && "bg-doodle-green/50",
			)}
		>
			<RoughBox
				padding={0}
				className="size-full"
				backgroundClassName="saturate-50"
				containerClassName="flex items-center justify-center"
				roughConfig={{
					stroke: "currentColor",
					strokeWidth: 4,
					strokeLineDash: [16, 8],
				}}
			>
				{children}
			</RoughBox>
		</div>
	);
}

interface PuzzleGameProps {
	onWin: () => void;
}

export function PuzzleGame({ onWin }: PuzzleGameProps) {
	const shuffledPieces = useMemo(
		// eslint-disable-next-line react-hooks/purity
		() => [...PIECES].sort(() => Math.random() - 0.5),
		[],
	);

	const [slots, setSlots] = useState<(Piece | null)[]>(
		Array(PIECES.length).fill(null),
	);
	const [unplacedPieces, setUnplacedPieces] = useState<Piece[]>(shuffledPieces);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		const activeId = active.id.toString();

		const draggedPiece = PIECES.find((p) => p.id.toString() === activeId);
		if (!draggedPiece) return;

		const originSlotIndex = slots.findIndex(
			(p) => p?.id.toString() === activeId,
		);
		const isFromUnplaced = originSlotIndex === -1;

		// TH1: Kéo thả ra ngoài
		if (!over) {
			if (!isFromUnplaced) {
				setSlots((prev) => {
					const newSlots = [...prev];
					newSlots[originSlotIndex] = null;
					return newSlots;
				});
				setUnplacedPieces((prev) => [...prev, draggedPiece]);
				playSound("pop");
			}
			return;
		}

		// TH2: Kéo thả vào một slot
		const targetSlotId = over.id.toString();
		const targetSlotIndex = PIECES.findIndex(
			(p) => p.id.toString() === targetSlotId,
		);
		if (targetSlotIndex === -1) return;

		const pieceInTargetSlot = slots[targetSlotIndex];

		if (pieceInTargetSlot?.id.toString() === activeId) return;

		playSound("pop");

		const newSlots = [...slots];
		let newUnplacedPieces = [...unplacedPieces];

		// Bước 1: Tháo mảnh ghép đang kéo khỏi vị trí ban đầu
		if (isFromUnplaced) {
			newUnplacedPieces = newUnplacedPieces.filter(
				(p) => p.id.toString() !== activeId,
			);
		} else {
			newSlots[originSlotIndex] = null;
		}

		// Bước 2: Xử lý mảnh ghép cũ trong slot đích (nếu có)
		if (pieceInTargetSlot) {
			if (isFromUnplaced) {
				// Nếu kéo từ khu chưa đặt -> mảnh cũ ở slot đích đi ra khu chưa đặt
				newUnplacedPieces.push(pieceInTargetSlot);
			} else {
				// Nếu kéo từ slot -> slot (hoán đổi) -> mảnh cũ ở slot đích đi vào slot nguồn
				newSlots[originSlotIndex] = pieceInTargetSlot;
			}
		}

		// Bước 3: Đặt mảnh ghép đang kéo vào slot đích
		newSlots[targetSlotIndex] = draggedPiece;

		// Bước 4: Cập nhật state
		setSlots(newSlots);
		setUnplacedPieces(newUnplacedPieces);
	}

	useEffect(() => {
		const isWin = slots.every((slot, index) => slot?.id === PIECES[index].id);
		if (isWin) {
			playSound("yay");
			onWin();
		}
	}, [slots, onWin]);

	return (
		<DndContext onDragEnd={handleDragEnd}>
			<div className="flex flex-col h-full">
				{/* Nửa trên: Slots */}
				<div className="h-1/3 flex justify-center items-center gap-4">
					{PIECES.map((piece, index) => (
						<DroppableSlot key={piece.id} id={piece.id.toString()}>
							{slots[index] ? <DraggablePiece piece={slots[index]!} /> : null}
						</DroppableSlot>
					))}
				</div>
				{/* Nửa dưới: Mảnh ghép lộn xộn */}
				<div className="flex-1 flex relative flex-wrap justify-center">
					<div className="w-full h-4 top-0 left-0 bg-amber-900 saturate-50 scale-x-120" />
					<div className="flex justify-center items-center flex-wrap gap-4 w-120 h-fit">
						{unplacedPieces.map((piece) => (
							<DraggablePiece key={piece.id} piece={piece} />
						))}
					</div>
				</div>
			</div>
		</DndContext>
	);
}
