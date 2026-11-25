"use client";

import { forwardRef } from "react";
import { RoughNotation } from "react-rough-notation";
import RoughBox from "@/shared/components/RoughBox";
import ButterflyIcon from "@/shared/icons/ButterflyIcon";
import HeartIcon from "@/shared/icons/HeartIcon";
import LeafIcon from "@/shared/icons/LeafIcon";
import StarIcon from "@/shared/icons/StarIcon";
import TulipIcon from "@/shared/icons/TulipIcon";
import BlankBookPage from "../BlankBookPage";
import BookNumber from "./BookNumber";

interface IntroBookPageProps {
  /** Mặt thiết kế sẵn của trang; truyền để override khi đổi chế độ hiển thị */
  side?: "left" | "right";
}

const IntroBookPage4 = forwardRef<HTMLDivElement, IntroBookPageProps>(
  ({ side = "left" }, ref) => {
    return (
      <BlankBookPage ref={ref} side={side}>
        <BookNumber pageNumber={4} side={side} />

        <section className="relative size-full flex flex-col pl-9 pr-9 pt-16 text-blue-700 z-10">
          <h2 className="font-bold text-lg leading-7">
            Trong cuốn sổ này có{" "}
            <RoughNotation
              type="highlight"
              color="var(--color-green-300)"
              animationDelay={400}
              show
            >
              gì?
            </RoughNotation>
          </h2>
          <p className="mt-4 indent-6 leading-6 text-justify max-w-105 pr-6">
            Không phải những trang viết dài dòng đâu. Là những ô nhỏ được dán
            đầy kỷ niệm: vài tấm hình chụp vội, vài dòng chữ viết tay, và cả
            những thứ vụn vặt khác mà tụi mình đã sống cùng nhau trong hai năm
            qua.
          </p>
          <p className="mt-4 indent-6 leading-6 text-justify max-w-105 pr-6">
            Mỗi ô là một mẩu chuyện của riêng tụi mình: một nụ cười, một chuyến
            đi, một bộ phim xem dở, hay chỉ là một buổi tối chẳng có gì đặc biệt
            — nhưng là buổi tối có em, nên anh vẫn muốn cất giữ.
          </p>
        </section>

        {/* Minh hoạ: một mặt giấy gồm 4 ô kỷ niệm */}
        <div className="absolute right-8 bottom-11 z-10 w-56">
          <RoughBox
            className="absolute -top-3 left-8 w-22 h-5 -rotate-12 z-10"
            padding={4}
            roughConfig={{
              stroke: "transparent",
              fill: "color-mix(in srgb, var(--color-yellow-200) 94%, transparent)",
              fillStyle: "solid",
              fillWeight: 5,
              roughness: 0.5,
            }}
          />

          <div className="grid grid-cols-2 gap-2.5">
            <RoughBox
              className="h-23"
              padding={8}
              containerClassName="flex items-center justify-center"
              roughConfig={{
                fill: "color-mix(in srgb, var(--color-yellow-100) 55%, transparent)",
                fillStyle: "solid",
                stroke:
                  "color-mix(in srgb, var(--color-blue-700) 30%, transparent)",
                roughness: 0.8,
                strokeWidth: 1.3,
              }}
            >
              <HeartIcon
                className="size-6 text-red-400 rotate-12"
                roughConfig={{ fill: "var(--color-red-200)" }}
              />
            </RoughBox>
            <RoughBox
              className="h-23"
              padding={8}
              containerClassName="flex items-center justify-center"
              roughConfig={{
                fill: "color-mix(in srgb, var(--color-sky-100) 55%, transparent)",
                fillStyle: "solid",
                stroke:
                  "color-mix(in srgb, var(--color-blue-700) 30%, transparent)",
                roughness: 0.8,
                strokeWidth: 1.3,
              }}
            >
              <StarIcon
                className="size-6 text-amber-400 -rotate-12"
                roughConfig={{
                  fill: "var(--color-amber-200)",
                  fillStyle: "solid",
                }}
              />
            </RoughBox>
            <RoughBox
              className="h-23"
              padding={8}
              containerClassName="flex items-center justify-center"
              roughConfig={{
                fill: "color-mix(in srgb, var(--color-rose-100) 55%, transparent)",
                fillStyle: "solid",
                stroke:
                  "color-mix(in srgb, var(--color-blue-700) 30%, transparent)",
                roughness: 0.8,
                strokeWidth: 1.3,
              }}
            >
              <TulipIcon
                className="size-6 text-pink-400"
                roughConfig={{
                  roughness: 0.15,
                  strokeWidth: 0.6,
                  fill: "var(--color-rose-300)",
                }}
              />
            </RoughBox>
            <RoughBox
              className="h-23"
              padding={8}
              containerClassName="flex items-center justify-center"
              roughConfig={{
                fill: "color-mix(in srgb, var(--color-green-100) 55%, transparent)",
                fillStyle: "solid",
                stroke:
                  "color-mix(in srgb, var(--color-blue-700) 30%, transparent)",
                roughness: 0.8,
                strokeWidth: 1.3,
              }}
            >
              <LeafIcon
                className="size-6 text-green-500 rotate-y-180"
                roughConfig={{
                  fill: "var(--color-green-300)",
                  fillStyle: "solid",
                }}
              />
            </RoughBox>
          </div>

          <p className="mt-2 text-center text-sm font-bold text-blue-800">
            một mặt giấy = 4 ô kỷ niệm
          </p>
        </div>

        <p className="absolute bottom-10 left-8 z-10 w-50 text-[13px] leading-6 font-semibold text-blue-800/85">
          Ô nào còn trống là anh cố tình để dành — cho những ngày mai của tụi
          mình.
        </p>

        <div className="absolute inset-0 size-full pointer-events-none">
          <RoughBox
            className="absolute top-4 right-4 w-24 h-6 rotate-12 z-10"
            padding={4}
            roughConfig={{
              stroke: "transparent",
              fill: "color-mix(in srgb, var(--color-rose-200) 90%, transparent)",
              fillStyle: "solid",
              fillWeight: 5,
              roughness: 0.5,
            }}
          />
          <StarIcon
            className="absolute top-28 right-4 size-6 text-yellow-300 rotate-12"
            roughConfig={{
              fill: "var(--color-yellow-200)",
              fillStyle: "solid",
            }}
          />
          <HeartIcon
            className="absolute top-24 right-4 size-4 text-red-300 -rotate-12 opacity-80"
            roughConfig={{ fill: "var(--color-red-200)" }}
          />
          <ButterflyIcon
            className="absolute top-36 right-2 size-18 text-pink-300 -rotate-20 opacity-80"
            roughConfig={{ roughness: 0.2, fill: "var(--color-pink-200)" }}
          />
          <HeartIcon
            className="absolute bottom-4 left-8 size-4 text-red-300 rotate-12 opacity-60"
            roughConfig={{ fill: "var(--color-red-200)" }}
          />
        </div>
      </BlankBookPage>
    );
  },
);
IntroBookPage4.displayName = "IntroBookPage4";

export default IntroBookPage4;
