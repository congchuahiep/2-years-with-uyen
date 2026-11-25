"use client";

import { forwardRef } from "react";
import Image from "next/image";
import Polaroid from "@/shared/components/Polaroid";
import RoughBox from "@/shared/components/RoughBox";
import ButterflyIcon from "@/shared/icons/ButterflyIcon";
import CurvedArrowIcon from "@/shared/icons/CurvedArrowIcon";
import DaisyIcon from "@/shared/icons/DaisyIcon";
import FireworksIcon from "@/shared/icons/FireworksIcon";
import HeartIcon from "@/shared/icons/HeartIcon";
import LeafIcon from "@/shared/icons/LeafIcon";
import RoseIcon from "@/shared/icons/RoseIcon";
import StarIcon from "@/shared/icons/StarIcon";
import TulipIcon from "@/shared/icons/TulipIcon";
import BlankBookPage from "../BlankBookPage";
import BookNumber from "./BookNumber";

interface IntroBookPageProps {
  /** Mặt thiết kế sẵn của trang; truyền để override khi đổi chế độ hiển thị */
  side?: "left" | "right";
}

const IntroBookPage2 = forwardRef<HTMLDivElement, IntroBookPageProps>(
  ({ side = "left" }, ref) => {
    return (
      <BlankBookPage ref={ref} side={side}>
        <BookNumber pageNumber={2} side={side} />

        <section className="relative size-full flex flex-col pl-18 text-blue-700 pt-16.75 z-10">
          <p className="indent-6 leading-6 max-w-76 text-justify">
            Món quà của em quá đặc biệt mà làm anh quá là lép vế, và thật sự 2
            năm vừa qua anh không tận dụng thời gian giỏi như em được. Dù tự
            nhận là “lép vế” và vẫn đang nợ em nửa năm hoàn thiện{" "}
            <i>(tính từ thời điểm làm quà)</i>, nhưng từng trang giấy ảo ở đây
            đều là sự chuẩn bị chu đáo nhất từ anh.
          </p>

          <Polaroid
            size="sm"
            className="absolute bottom-20 -rotate-12"
            text="Hồi kỷ niệm 1 năm"
          >
            <RoughBox className="size-full">
              <Image
                src="/uyen-xinh-gai.jpg"
                alt="Uyên xinh gái"
                className="object-cover -z-50 pointer-events-none"
                fill
              />
            </RoughBox>

            <RoughBox
              className="font-bold w-22 h-9 text-center absolute -top-4 -left-8 z-10 -rotate-40"
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
              className="font-bold w-26 h-8 text-center absolute -bottom-12 -right-8 z-10 -rotate-20"
              padding={4}
              roughConfig={{
                stroke: "transparent",
                fill: "color-mix(in srgb, var(--color-yellow-200) 94%, transparent)",
                fillStyle: "solid",
                fillWeight: 5,
                roughness: 0.5,
              }}
            />
          </Polaroid>

          <div className="absolute bottom-32 right-8 -rotate-16 text-blue-600 font-bold text-right ">
            <p>người đẹp</p>
            <p className="pr-2">ánh mắt long lanh.</p>
          </div>

          <CurvedArrowIcon
            className="size-30 absolute bottom-32 right-24 rotate-180 rotate-x-180 text-blue-600"
            roughConfig={{ roughness: 0.2, strokeWidth: 0.7 }}
          />
        </section>

        <div className="absolute inset-0 size-full z-0">
          <HeartIcon
            className="absolute top-7 left-32 -rotate-16 size-6 text-red-300"
            roughConfig={{ fill: "var(--color-red-200)" }}
          />
          <FireworksIcon
            className="absolute size-30 text-yellow-200 rotate-16 right-4 top-12"
            roughConfig={{ roughness: 0.2 }}
          />
          <StarIcon
            className="absolute size-20 text-amber-300 rotate-20 right-8 top-17"
            roughConfig={{
              roughness: 0.2,
              fill: "var(--color-amber-200)",
              fillStyle: "solid",
            }}
          />
          <ButterflyIcon
            className="absolute size-30 text-pink-300 -rotate-32 right-8 top-47 z-10"
            roughConfig={{ roughness: 0.2, fill: "var(--color-pink-200)" }}
          />
          <RoseIcon
            className="absolute size-28 text-rose-200 -rotate-32 right-12 top-72"
            roughConfig={{
              roughness: 0.2,
              strokeWidth: 0.5,
              fill: "var(--color-rose-300)",
            }}
          />
          <TulipIcon
            className="absolute size-34 text-pink-400 rotate-12 right-28 top-62"
            roughConfig={{
              roughness: 0.1,
              strokeWidth: 0.5,
              fill: "var(--color-rose-300)",
            }}
          />
          {/* Thêm hoa rải đều các vùng trống của trang (nửa trái và dọc cạnh). */}
          <TulipIcon
            className="absolute size-16 text-pink-400 rotate-12 left-4 top-16 opacity-60"
            roughConfig={{
              roughness: 0.2,
              strokeWidth: 0.5,
              fill: "var(--color-pink-200)",
            }}
          />
          <RoseIcon
            className="absolute size-18 text-rose-200 -rotate-12 left-6 bottom-8 opacity-65"
            roughConfig={{
              roughness: 0.2,
              strokeWidth: 0.5,
              fill: "var(--color-rose-200)",
            }}
          />
          <TulipIcon
            className="absolute size-14 text-purple-300 rotate-24 left-2 top-85 opacity-60"
            roughConfig={{
              roughness: 0.2,
              strokeWidth: 0.5,
              fill: "var(--color-purple-200)",
            }}
          />
          <DaisyIcon
            className="absolute size-16 text-yellow-100 -rotate-18 right-2 top-38 opacity-60"
            roughConfig={{
              fill: "var(--color-yellow-100)",
              roughness: 0.5,
              strokeWidth: 0.5,
            }}
          />
          <TulipIcon
            className="absolute size-12 text-rose-300 -rotate-24 right-2 bottom-12 opacity-65"
            roughConfig={{
              roughness: 0.2,
              strokeWidth: 0.5,
              fill: "var(--color-rose-200)",
            }}
          />
          {/* Cụm nhánh lá lớn ở góc dưới-phải (3 lá xếp chồng tạo cành). */}
          <LeafIcon
            className="absolute size-28 text-green-300 rotate-12 right-2 bottom-2 opacity-50"
            roughConfig={{
              roughness: 0.2,
              strokeWidth: 0.5,
              fill: "var(--color-green-200)",
            }}
          />
          <LeafIcon
            className="absolute size-24 text-green-400 -rotate-18 right-16 bottom-6 opacity-55"
            roughConfig={{
              roughness: 0.2,
              strokeWidth: 0.5,
              fill: "var(--color-green-300)",
            }}
          />
          <LeafIcon
            className="absolute size-20 text-green-500 rotate-45 right-24 bottom-0 opacity-50"
            roughConfig={{
              roughness: 0.2,
              strokeWidth: 0.5,
              fill: "var(--color-green-400)",
            }}
          />
          {/* Cụm nhánh lá nhỏ ven cạnh trái (2 lá). */}
          <LeafIcon
            className="absolute size-16 text-emerald-300 -rotate-30 left-2 top-30 opacity-55"
            roughConfig={{
              roughness: 0.2,
              strokeWidth: 0.5,
              fill: "var(--color-emerald-200)",
            }}
          />
          <LeafIcon
            className="absolute size-14 text-green-400 rotate-45 left-0 top-65 opacity-50"
            roughConfig={{
              roughness: 0.2,
              strokeWidth: 0.5,
              fill: "var(--color-green-300)",
            }}
          />
          {/* Trái tim rải đều các vùng trống còn lại. */}
          <HeartIcon
            className="absolute size-5 text-pink-300 rotate-12 left-8 top-30 opacity-70"
            roughConfig={{ fill: "var(--color-pink-200)" }}
          />
          <HeartIcon
            className="absolute size-4 text-red-300 -rotate-12 left-2 top-72 opacity-70"
            roughConfig={{ fill: "var(--color-red-200)" }}
          />
          <HeartIcon
            className="absolute size-5 text-yellow-300 rotate-24 right-1 top-22 opacity-70"
            roughConfig={{ fill: "var(--color-yellow-200)" }}
          />
          <HeartIcon
            className="absolute size-4 text-purple-300 -rotate-18 right-3 top-58 opacity-70"
            roughConfig={{ fill: "var(--color-purple-200)" }}
          />
          <HeartIcon
            className="absolute size-5 text-rose-300 rotate-12 right-1 top-78 opacity-70"
            roughConfig={{ fill: "var(--color-rose-200)" }}
          />

          <HeartIcon
            className="absolute bottom-54 right-4 rotate-2 size-4 text-pink-300"
            roughConfig={{ fill: "var(--color-blue-200)" }}
          />
          <HeartIcon
            className="absolute bottom-50 right-8 rotate-16 size-6 text-blue-300"
            roughConfig={{ fill: "var(--color-pink-200)" }}
          />
        </div>
      </BlankBookPage>
    );
  },
);
IntroBookPage2.displayName = "IntroBookPage2";

export default IntroBookPage2;
