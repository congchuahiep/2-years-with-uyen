"use client";

import { forwardRef } from "react";
import { RoughNotation } from "react-rough-notation";
import RoughBox from "@/shared/components/RoughBox";
import ArrowIcon from "@/shared/icons/ArrowIcon";
import DaisyIcon from "@/shared/icons/DaisyIcon";
import FireworksIcon from "@/shared/icons/FireworksIcon";
import HeartIcon from "@/shared/icons/HeartIcon";
import ShootingStarIcon from "@/shared/icons/ShootingStarIcon";
import StarIcon from "@/shared/icons/StarIcon";
import BlankBookPage from "../BlankBookPage";
import BookNumber from "./BookNumber";

interface IntroBookPageProps {
  /** Mặt thiết kế sẵn của trang; truyền để override khi đổi chế độ hiển thị */
  side?: "left" | "right";
}

const IntroBookPage5 = forwardRef<HTMLDivElement, IntroBookPageProps>(
  ({ side = "right" }, ref) => {
    return (
      <BlankBookPage ref={ref} side={side}>
        <BookNumber pageNumber={5} side={side} />

        <section className="relative size-full flex flex-col pl-9 pr-9 pt-16 text-blue-700 z-10">
          <h2 className="font-display text-3xl leading-tight font-bold">
            Sẵn sàng chưa?
          </h2>
          <p className="mt-5 indent-6 leading-6 text-justify max-w-105">
            Phía sau trang này là những ngày đầu của tụi mình — anh đã gom góp
            chúng từng chút một suốt hai năm qua, để kể lại cho em nghe trong
            một buổi tối.
          </p>
          <p className="mt-4 indent-6 leading-6 text-justify max-w-105 pr-2">
            Và nếu có ô nào làm em bật cười, hãy{" "}
            <RoughNotation
              type="highlight"
              color="var(--color-yellow-300)"
              animationDelay={500}
              show
            >
              cười thật to
            </RoughNotation>{" "}
            — vì ngay lúc đó, anh cũng đang mỉm cười ở phía bên kia màn hình.
          </p>

          <div className="mt-12 flex items-center gap-4 pl-2">
            <span className="font-display text-xl font-bold text-blue-800">
              Bắt đầu thôi!
            </span>
            <ArrowIcon
              variant="thick"
              className="size-11 text-blue-600 -rotate-3"
              roughConfig={{ strokeWidth: 2 }}
            />
          </div>
        </section>

        <div className="absolute inset-0 size-full pointer-events-none">
          <RoughBox
            className="absolute top-6 right-6 w-24 h-6 -rotate-12 z-10"
            padding={4}
            roughConfig={{
              stroke: "transparent",
              fill: "color-mix(in srgb, var(--color-rose-200) 90%, transparent)",
              fillStyle: "solid",
              fillWeight: 5,
              roughness: 0.5,
            }}
          />
          <ShootingStarIcon
            className="absolute top-14 right-12 size-12 text-yellow-300 rotate-12"
            roughConfig={{
              fill: "var(--color-yellow-200)",
              fillStyle: "solid",
            }}
          />
          <HeartIcon
            className="absolute top-18 right-5 size-5 text-red-300 rotate-12 opacity-80"
            roughConfig={{ fill: "var(--color-red-200)" }}
          />
          <HeartIcon
            className="absolute top-23 right-9 size-4 text-green-300 -rotate-12 opacity-80"
            roughConfig={{ fill: "var(--color-green-200)" }}
          />
          <FireworksIcon
            className="absolute right-5 bottom-14 size-20 text-yellow-200 rotate-12"
            roughConfig={{ roughness: 0.2 }}
          />
          <StarIcon
            className="absolute right-28 bottom-18 size-7 text-purple-300 -rotate-12 opacity-80"
            roughConfig={{
              fill: "var(--color-purple-200)",
              fillStyle: "solid",
            }}
          />
          <DaisyIcon
            className="absolute left-10 bottom-32 size-16 text-amber-100 -rotate-18 opacity-70"
            roughConfig={{ fill: "var(--color-green-300)", roughness: 0.7 }}
          />
          <HeartIcon
            className="absolute bottom-12 left-32 size-4 text-pink-300 rotate-12 opacity-70"
            roughConfig={{ fill: "var(--color-pink-200)" }}
          />
        </div>
      </BlankBookPage>
    );
  },
);
IntroBookPage5.displayName = "IntroBookPage5";

export default IntroBookPage5;
