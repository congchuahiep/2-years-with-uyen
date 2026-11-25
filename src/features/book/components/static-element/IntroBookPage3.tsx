"use client";

import { forwardRef } from "react";
import Image from "next/image";
import Polaroid from "@/shared/components/Polaroid";
import RoughBox from "@/shared/components/RoughBox";
import RoughBunting from "@/shared/components/RoughBunting";
import CalendarIcon from "@/shared/icons/CalendarIcon";
import HeartIcon from "@/shared/icons/HeartIcon";
import LeafIcon from "@/shared/icons/LeafIcon";
import ShootingStarIcon from "@/shared/icons/ShootingStarIcon";
import StarIcon from "@/shared/icons/StarIcon";
import BlankBookPage from "../BlankBookPage";
import BookNumber from "./BookNumber";

interface IntroBookPageProps {
  /** Mặt thiết kế sẵn của trang; truyền để override khi đổi chế độ hiển thị */
  side?: "left" | "right";
}

const IntroBookPage3 = forwardRef<HTMLDivElement, IntroBookPageProps>(
  ({ side = "right" }, ref) => {
    return (
      <BlankBookPage ref={ref} side={side}>
        <BookNumber pageNumber={3} side={side} />

        <section className="relative size-full flex flex-col p-9 text-blue-700 pt-22.75 pr-8 z-10">
          <p className="indent-6 leading-6 absolute top-52.75 left-56 w-67 text-justify">
            Anh hi vọng rằng từng trang giấy ở đây có thể bù đắp phần nào trong
            nửa năm vừa qua.
          </p>
          <p className="indent-6 leading-6 absolute bottom-20 w-70 text-justify">
            Cảm ơn em vì đã chấp nhận một người khá là vụng về chậm chạp này là
            người em thương. Cảm ơn em vì suốt 2 năm qua em đã luôn đồng hành
            không chịu buông tay. Cảm ơn em làm người để viết nên câu chuyện
            này, và anh mong rằng hai ta có thể viết tiếp nữa!!
          </p>

          <Polaroid size="xs" className="absolute top-28 left-8 -rotate-6">
            <RoughBox className="size-full">
              <Image
                src="/uyen+hiep-1.jpg"
                alt="Uyên + Hiệp ở hồ Eakao"
                className="object-cover -z-50 pointer-events-none"
                fill
              />
            </RoughBox>

            <RoughBox
              className="font-bold w-22 h-7 text-center absolute -top-4 -left-8 z-10 -rotate-30"
              padding={4}
              roughConfig={{
                stroke: "transparent",
                fill: "color-mix(in srgb, var(--color-yellow-200) 94%, transparent)",
                fillStyle: "solid",
                fillWeight: 5,
                roughness: 0.5,
              }}
            />

            <RoughBox
              className="font-bold w-18 h-8 text-center absolute -top-4 -right-8 z-10 rotate-20"
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

          <Polaroid size="xs" className="absolute bottom-32 right-6 rotate-6">
            <RoughBox className="size-full">
              <Image
                src="/uyen+hiep-2.jpg"
                alt="Làm gì đó không bíc"
                className="object-cover -z-50 pointer-events-none"
                fill
              />
            </RoughBox>

            <RoughBox
              className="font-bold w-22 h-7 text-center absolute -top-4 -left-8 z-10 -rotate-30"
              padding={4}
              roughConfig={{
                stroke: "transparent",
                fill: "color-mix(in srgb, var(--color-yellow-200) 94%, transparent)",
                fillStyle: "solid",
                fillWeight: 5,
                roughness: 0.5,
              }}
            />

            <RoughBox
              className="font-bold w-18 h-8 text-center absolute -top-4 -right-8 z-10 rotate-20"
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
        </section>

        <div className="absolute inset-0 size-full">
          <RoughBunting
            className="absolute top-20 rotate-16 z-10"
            ropeColor="var(--color-amber-200)"
            colors={[
              "var(--color-rose-300)",
              "var(--color-sky-300)",
              "var(--color-lime-200)",
            ]}
            roughConfig={{
              roughness: 2,
              stroke: "var(--color-amber-200)",
            }}
            sag={50}
          />

          <HeartIcon
            className="absolute top-12 right-24 -rotate-12 size-12 text-pink-300"
            roughConfig={{ fill: "var(--color-blue-200)" }}
          />
          <ShootingStarIcon
            className="absolute top-2 left-20 rotate-12 size-16 text-yellow-300 rotate-x-180"
            roughConfig={{
              fill: "var(--color-yellow-200)",
              fillStyle: "solid",
            }}
          />

          <LeafIcon
            className="absolute -bottom-3 left-8 opacity-50 rotate-120 size-24 text-green-300 rotate-x-180"
            roughConfig={{ fill: "var(--color-green-200)", fillStyle: "solid" }}
          />

          <CalendarIcon
            className="absolute bottom-8 right-20 rotate-12 size-24 text-red-400 rotate-y-180 opacity-70"
            roughConfig={{ roughness: 0.4 }}
          />

          <StarIcon
            className="absolute top-58 left-40 rotate-12 size-12 text-green-200"
            roughConfig={{ fill: "var(--color-pink-300)", fillStyle: "solid" }}
          />
          <StarIcon
            className="absolute top-42 right-10 rotate-24 size-8 text-blue-300"
            roughConfig={{ fill: "var(--color-amber-200)", fillStyle: "solid" }}
          />
        </div>
      </BlankBookPage>
    );
  },
);
IntroBookPage3.displayName = "TitleBookPage3";

export default IntroBookPage3;
