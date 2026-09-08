"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { RoughNotation } from "react-rough-notation";
import { HeartIcon } from "@/components/icon/heart";
import { Polaroid } from "@/components/ui/polaroid";
import { RoughBox } from "@/components/ui/rough-box";
import { BlankBookPage } from "../blank-book-page";
import { BookNumber } from "./book-number";

export const TitleBookPage = forwardRef<HTMLDivElement>((_, ref) => {
	return (
		<BlankBookPage ref={ref} side="right">
			<BookNumber pageNumber={1} side="right" />

			<section className="flex flex-col justify-center p-9 text-blue-900 pt-16.25 pr-8">
				<h2 className="font-bold text-lg">
					Gửi tặng{" "}
					<RoughNotation
						type="highlight"
						color="var(--color-green-400)"
						animationDelay={500}
						show
					>
						Ngọc Uyên
					</RoughNotation>
				</h2>
				<p className="mt-5.5 indent-6 leading-6">
					Hai năm nghe thì ngắn, nhưng thật ra đó cả một khoảng trời ký ức, bằng
					gần 1/40 cả cuộc đời mỗi người. Chúng ta đã cùng nhau đi qua 730 ngày
					không phải chỉ để đếm, mà để yêu thương, để trưởng thành. Dấu mốc này
					quan trọng không chỉ vì con số, mà vì nó đánh dấu một hành trình mà
					anh luôn biết ơn em. Nhưng mà, trong ngày kỉ niệm này, có lẽ anh vẫn
					chưa làm đủ tốt...
				</p>
				<p className="mt-6 indent-6 leading-6">
					Khi anh nhìn thấy món quà em tặng, anh cảm thấy rất hạnh phúc và biết
					ơn. Nhưng có 1 phần lớn trong con người anh rất buồn, vì món
				</p>
				<p className="text-justify after:w-full after:inline-block w-65 h-6">
					quà của anh không đủ tốt để
				</p>
				<p className="text-justify after:w-full after:inline-block w-64 h-6">
					cảm nhận được những gì em
				</p>
				<p className="text-justify after:w-full after:inline-block w-64 h-6">
					đang muốn gửi. Cảm xúc này
				</p>
				<p className="text-justify after:w-full after:inline-block w-63 h-6">
					không phải do hơn thua, mà
				</p>
				<p className="text-justify after:w-full after:inline-block w-62 h-6">
					một phần trong anh thấy em
				</p>
				<p className="text-justify after:w-full after:inline-block w-61 h-6">
					vốn thiệt thòi khi nhìn thấy
				</p>
				<p className="text-justify after:w-full after:inline-block w-60 h-6">
					người mình yêu bỏ nhiều
				</p>
				<p className="">công sức bằng mình :'(</p>

				<Polaroid
					className="absolute rotate-6 right-6 bottom-18"
					size="sm"
					text="Quà Uyên Tặng"
				>
					<RoughBox className="size-full">
						<Image
							src="/uyen-gift.jpg"
							alt="Quà Uyên tặng Tui"
							className="object-cover -z-50 pointer-events-none"
							fill
						/>
					</RoughBox>

					<RoughBox
						className="font-bold w-26 h-8 text-center absolute -top-4 -right-7 z-10 rotate-24"
						padding={4}
						roughConfig={{
							stroke: "transparent",
							fill: "color-mix(in srgb, var(--color-yellow-200) 94%, transparent)",
							fillStyle: "solid",
							fillWeight: 5,
							roughness: 0.5,
						}}
          />

					<HeartIcon
						className="absolute -bottom-7 left-28 rotate-12"
						roughConfig={{ fill: "var(--color-red-300)" }}
					/>
				</Polaroid>

				<HeartIcon
					className="absolute top-4 left-4"
					roughConfig={{ fill: "var(--color-red-300)" }}
				/>
			</section>
		</BlankBookPage>
	);
});

TitleBookPage.displayName = "TitleBookPage";
