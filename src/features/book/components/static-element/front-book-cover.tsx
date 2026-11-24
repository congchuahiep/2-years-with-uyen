"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { DaisyIcon } from "@/shared/icons/daisy";
import { HeartIcon } from "@/shared/icons/heart";
import { ShootingStarIcon } from "@/shared/icons/shooting-star";
import { StarIcon } from "@/shared/icons/star";
import { Polaroid } from "@/shared/components/polaroid";
import { RoughBox } from "@/shared/components/rough-box";
import { BookCover } from "../book-cover";

export const FrontBookCover = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <BookCover ref={ref}>
      {/* Sao băng góc trên trái */}
      <ShootingStarIcon
        className="absolute top-8 left-10 size-14 -rotate-15"
        roughConfig={{
          stroke: "var(--color-yellow-200)",
          strokeWidth: 1.2,
        }}
      />

      {/* Ngôi sao nhỏ rải quanh */}
      <StarIcon
        className="absolute top-40 left-7 size-6 rotate-6"
        roughConfig={{
          stroke: "var(--color-yellow-200)",
          fill: "var(--color-yellow-200)",
          fillWeight: 8,
        }}
      />
      <StarIcon
        className="absolute top-54 left-18 size-6 -rotate-24"
        roughConfig={{
          stroke: "var(--color-yellow-200)",
          fill: "var(--color-yellow-200)",
          fillWeight: 8,
        }}
      />
      <StarIcon
        className="absolute top-40 left-7 size-6 rotate-6"
        roughConfig={{
          stroke: "var(--color-yellow-200)",
          fill: "var(--color-yellow-200)",
          fillWeight: 8,
        }}
      />
      <StarIcon
        className="absolute top-60 left-12 size-6 rotate-12"
        roughConfig={{
          stroke: "var(--color-yellow-200)",
          fill: "var(--color-yellow-200)",
          fillWeight: 8,
        }}
      />
      <StarIcon
        className="absolute right-5 bottom-1/4 size-5 -rotate-12"
        roughConfig={{ stroke: "var(--color-yellow-300)" }}
      />

      <HeartIcon
        className="size-42 absolute top-52 right-50 translate-x-1/2 -translate-y-1/2 rotate-12"
        roughConfig={{
          stroke: "var(--color-pink-200)",
          strokeWidth: 1,
          fill: "var(--color-pink-300)",
          fillWeight: 4,
          fillStyle: "zigzag",
        }}
      />
      <HeartIcon
        className="size-32 absolute top-56 right-30 translate-x-1/2 -translate-y-1/2 rotate-45"
        roughConfig={{
          stroke: "var(--color-red-300)",
          strokeWidth: 1,
          fill: "var(--color-red-400)",
          fillWeight: 4,
          fillStyle: "zigzag",
        }}
      />

      {/* Polaroid kỷ niệm ở giữa */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-6">
        <Polaroid
          isLandscape
          className="shadow-sm"
          text="Uyên khóc vì tôi tặng quà dở ẹc"
        >
          <RoughBox className="size-full flex-1">
            <Image
              src="/happy-cry.jpg"
              alt="happy-cry"
              className="object-cover -z-50 pointer-events-none"
              fill
            />
          </RoughBox>
        </Polaroid>
        <RoughBox
          className="font-bold w-24 h-8 text-center absolute -top-2 -left-4 z-10 -rotate-12"
          padding={4}
          roughConfig={{
            stroke: "transparent",
            fill: "color-mix(in srgb, var(--color-blue-200) 94%, transparent)",
            fillStyle: "solid",
            fillWeight: 5,
            roughness: 0.5,
          }}
        />
        <RoughBox
          className="font-bold w-26 h-9 text-center absolute -bottom-1 -right-8 z-10 -rotate-24"
          padding={4}
          roughConfig={{
            stroke: "transparent",
            fill: "color-mix(in srgb, var(--color-green-200) 94%, transparent)",
            fillStyle: "solid",
            fillWeight: 5,
            roughness: 0.5,
          }}
        />
      </div>

      <RoughBox
        className="w-72 h-12 text-center text-yellow-950 absolute bottom-1/3 left-8 z-10 rotate-12 text-[2.5rem] translate-y-1/2 font-fancy"
        padding={12}
        roughConfig={{
          stroke: "transparent",
          fill: "var(--color-yellow-200)",
          fillStyle: "zigzag",
          fillWeight: 12,
          roughness: 2,
        }}
        containerClassName="flex justify-center items-center"
      >
        Uyên + Hiệp diary
      </RoughBox>

      {/* Cúc hoạ mi góc dưới phải (nổi lên mặt khung) */}
      <DaisyIcon className="absolute right-8 bottom-8 z-10 size-24 rotate-8" />
    </BookCover>
  );
});

FrontBookCover.displayName = "FrontBookCover";
