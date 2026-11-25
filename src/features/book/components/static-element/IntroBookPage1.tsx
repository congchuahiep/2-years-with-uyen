"use client";

import { forwardRef } from "react";
import { RoughNotation } from "react-rough-notation";
import { cn } from "@/shared/utils/cn";
import Polaroid from "@/shared/components/Polaroid";
import RoughBox from "@/shared/components/RoughBox";
import CalendarIcon from "@/shared/icons/CalendarIcon";
import DaisyIcon from "@/shared/icons/DaisyIcon";
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

const IntroBookPage1 = forwardRef<HTMLDivElement, IntroBookPageProps>(
  ({ side = "right" }, ref) => {
    return (
      <BlankBookPage ref={ref} side={side}>
        <BookNumber pageNumber={1} side={side} />

        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 w-4 z-10",
            "left-0 bg-linear-to-r from-black/50 to-transparent",
          )}
        />

        <section className="relative size-full flex flex-col p-9 text-blue-700 pt-16.25 pr-8 z-10">
          <h2 className="font-bold text-lg">
            Gửi tặng{" "}
            <RoughNotation
              type="highlight"
              color="var(--color-green-300)"
              animationDelay={500}
              show
            >
              Ngọc Uyên
            </RoughNotation>
          </h2>
          <p className="mt-5.5 indent-6 leading-6">
            Hai năm nghe thì ngắn, nhưng nó đã gần 1/40 cuộc đời mỗi người.
            Chúng ta đã cùng nhau đi qua 730 ngày để yêu thương và trưởng thành.
            Dấu mốc này quan trọng không vì con số, mà vì hành trình mà anh luôn
            biết ơn em. Nhưng trong ngày kỉ niệm này, có lẽ anh vẫn chưa làm đủ
            tốt...
          </p>

          <p className="mt-6 indent-6">
            Khi anh nhìn thấy món quà em tặng, anh cảm thấy rất hạnh phúc và
            biết ơn. Có vẻ như em đã chuẩn bị
          </p>
          <p className="text-justify after:w-full after:inline-block w-73 h-6">
            được món quà này trong 2 năm
          </p>
          <p className="text-justify after:w-full after:inline-block w-72 h-6">
            chứ không phải mới gần đây. Từ ý
          </p>
          <p className="text-justify after:w-full after:inline-block w-71 h-6">
            tưởng cho đến cách trình bày,
          </p>
          <p className="text-justify after:w-full after:inline-block w-71 h-6">
            dường mọi thứ trông thật perfect.
          </p>
          <p className="text-justify after:w-full after:inline-block w-69 h-6">
            Anh là anh cực kỳ ưng cách em
          </p>
          <p className="text-justify after:w-full after:inline-block w-68.5 h-6">
            chọn cái phong cách này, mặc
          </p>
          <p className="text-justify after:w-full after:inline-block w-68 h-6">
            dù hơi trùng ý tưởng nhau.
          </p>
          <p className="text-justify after:w-full after:inline-block w-66 h-6">
            Nhưng vì cái yêu nghệ thuật
          </p>
          <p className="text-justify after:w-full after:inline-block w-64 h-6">
            như này chính là lý do mình lại
          </p>
          <p className="text-justify after:w-full after:inline-block w-62 h-6">
            chọn nhau để đồng hành.
          </p>

          <Polaroid
            className="absolute rotate-9 right-8 bottom-22"
            size="xs"
            text="Quà Uyên Tặng"
          >
            <RoughBox
              className="size-full overflow-hidden"
              containerClassName="flex items-center justify-center"
            >
              <video
                src="/uyen-gift.webm"
                autoPlay
                loop
                muted
                playsInline
                className="object-cover pointer-events-none size-full scale-125 h-36"
              />
            </RoughBox>

            <RoughBox
              className="font-bold w-26 h-8 text-center absolute -top-4 -right-7 z-20 rotate-24"
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
              className="absolute -bottom-7 left-28 rotate-12 z-20"
              roughConfig={{ fill: "var(--color-red-300)" }}
            />
          </Polaroid>
        </section>

        <div className="absolute inset-0 size-full">
          <HeartIcon
            className="absolute top-7 left-32 -rotate-16 size-6 text-red-300"
            roughConfig={{ fill: "var(--color-red-200)" }}
          />
          <HeartIcon
            className="absolute top-10 left-40 rotate-12 size-6 text-green-300"
            roughConfig={{ fill: "var(--color-green-200)" }}
          />
          <HeartIcon
            className="absolute top-8 left-48 -rotate-30 size-6 text-yellow-300"
            roughConfig={{ fill: "var(--color-yellow-200)" }}
          />
          <HeartIcon
            className="absolute top-5 right-4 opacity-50 -rotate-12 size-20 text-green-200"
            roughConfig={{ fill: "var(--color-green-300)" }}
          />
          <ShootingStarIcon
            className="absolute top-2 right-20 rotate-12 size-16 text-yellow-300"
            roughConfig={{
              fill: "var(--color-yellow-200)",
              fillStyle: "solid",
            }}
          />

          <LeafIcon
            className="absolute bottom-0 left-20 opacity-50 rotate-45 size-24 text-green-300"
            roughConfig={{ fill: "var(--color-green-200)", fillStyle: "solid" }}
          />
          <LeafIcon
            className="absolute bottom-8 right-39 opacity-50 -rotate-50 size-20 text-purple-200 rotate-y-180"
            roughConfig={{ fill: "var(--color-green-100)", fillStyle: "solid" }}
          />

          <CalendarIcon
            className="absolute top-58 right-20 rotate-12 size-12 text-amber-800 rotate-y-180 opacity-70"
            roughConfig={{ fill: "var(--color-green-300)", roughness: 0.4 }}
          />

          <StarIcon
            className="absolute top-58 right-33 -rotate-12 size-7 text-purple-300"
            roughConfig={{
              fill: "var(--color-purple-200)",
              fillStyle: "solid",
            }}
          />
          <StarIcon
            className="absolute top-58 right-40 rotate-12 size-12 text-pink-200"
            roughConfig={{ fill: "var(--color-pink-300)", fillStyle: "solid" }}
          />
          <StarIcon
            className="absolute top-42 right-10 rotate-12 size-6 text-yellow-300"
            roughConfig={{
              fill: "var(--color-yellow-200)",
              fillStyle: "solid",
            }}
          />

          <DaisyIcon
            className="absolute bottom-4 left-4 -rotate-12 size-20 text-amber-100 rotate-y-180 opacity-70"
            roughConfig={{ fill: "var(--color-green-300)", roughness: 0.7 }}
          />
        </div>
      </BlankBookPage>
    );
  },
);
IntroBookPage1.displayName = "IntroBookPage1";

export default IntroBookPage1;
