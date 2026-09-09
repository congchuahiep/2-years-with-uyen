"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { RoughNotation } from "react-rough-notation";
import { cn } from "tailwind-variants";
import { ArrowIcon } from "@/components/icon/arrow";
import { ButterflyIcon } from "@/components/icon/butterfly";
import { CalendarIcon } from "@/components/icon/calendar";
import { CurvedArrowIcon } from "@/components/icon/curved-arrow";
import { DaisyIcon } from "@/components/icon/daisy";
import { FireworksIcon } from "@/components/icon/fireworks";
import { HeartIcon } from "@/components/icon/heart";
import { LeafIcon } from "@/components/icon/leaf";
import { RoseIcon } from "@/components/icon/rose";
import { ShootingStarIcon } from "@/components/icon/shooting-star";
import { StarIcon } from "@/components/icon/star";
import { TulipIcon } from "@/components/icon/tulip";
import { Polaroid } from "@/components/ui/polaroid";
import { RoughBox } from "@/components/ui/rough-box";
import { RoughBunting } from "@/components/ui/rough-bunting";
import { BlankBookPage } from "../blank-book-page";
import { BookPageScale } from "../book-page-scale";
import { BookNumber } from "./book-number";

interface IntroBookPageProps {
  /** Mặt thiết kế sẵn của trang; truyền để override khi đổi chế độ hiển thị */
  side?: "left" | "right";
}

export const IntroBookPage1 = forwardRef<HTMLDivElement, IntroBookPageProps>(({ side = "right" }, ref) => {
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
          Hai năm nghe thì ngắn, nhưng nó đã gần 1/40 cuộc đời mỗi người. Chúng
          ta đã cùng nhau đi qua 730 ngày để yêu thương và trưởng thành. Dấu mốc
          này quan trọng không vì con số, mà vì hành trình mà anh luôn biết ơn
          em. Nhưng trong ngày kỉ niệm này, có lẽ anh vẫn chưa làm đủ tốt...
        </p>

        <p className="mt-6 indent-6">
          Khi anh nhìn thấy món quà em tặng, anh cảm thấy rất hạnh phúc và biết
          ơn. Có vẻ như em đã chuẩn bị
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
          roughConfig={{ fill: "var(--color-yellow-200)", fillStyle: "solid" }}
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
          roughConfig={{ fill: "var(--color-purple-200)", fillStyle: "solid" }}
        />
        <StarIcon
          className="absolute top-58 right-40 rotate-12 size-12 text-pink-200"
          roughConfig={{ fill: "var(--color-pink-300)", fillStyle: "solid" }}
        />
        <StarIcon
          className="absolute top-42 right-10 rotate-12 size-6 text-yellow-300"
          roughConfig={{ fill: "var(--color-yellow-200)", fillStyle: "solid" }}
        />

        <DaisyIcon
          className="absolute bottom-4 left-4 -rotate-12 size-20 text-amber-100 rotate-y-180 opacity-70"
          roughConfig={{ fill: "var(--color-green-300)", roughness: 0.7 }}
        />
      </div>
    </BlankBookPage>
  );
});
IntroBookPage1.displayName = "IntroBookPage1";

export const IntroBookPage2 = forwardRef<HTMLDivElement, IntroBookPageProps>(({ side = "left" }, ref) => {
  return (
    <BlankBookPage ref={ref} side={side}>
      <BookNumber pageNumber={2} side={side} />

      <section className="relative size-full flex flex-col pl-18 text-blue-700 pt-16.75 z-10">
        <p className="indent-6 leading-6 max-w-76 text-justify">
          Món quà của em quá đặc biệt mà làm anh quá là lép vế, và thật sự 2 năm
          vừa qua anh không tận dụng thời gian giỏi như em được. Dù tự nhận là
          “lép vế” và vẫn đang nợ em nửa năm hoàn thiện{" "}
          <i>(tính từ thời điểm làm quà)</i>, nhưng từng trang giấy ảo ở đây đều
          là sự chuẩn bị chu đáo nhất từ anh.
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
});
IntroBookPage2.displayName = "IntroBookPage2";

export const IntroBookPage3 = forwardRef<HTMLDivElement, IntroBookPageProps>(({ side = "right" }, ref) => {
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
          không chịu buông tay. Cảm ơn em làm người để viết nên câu chuyện này,
          và anh mong rằng hai ta có thể viết tiếp nữa!!
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
          roughConfig={{ fill: "var(--color-yellow-200)", fillStyle: "solid" }}
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
});
IntroBookPage3.displayName = "TitleBookPage3";

export const IntroBookPage4 = forwardRef<HTMLDivElement, IntroBookPageProps>(
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
            Mỗi ô là một mẩu chuyện của riêng tụi mình: một nụ cười, một
            chuyến đi, một bộ phim xem dở, hay chỉ là một buổi tối chẳng có gì
            đặc biệt — nhưng là buổi tối có em, nên anh vẫn muốn cất giữ.
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
                stroke: "color-mix(in srgb, var(--color-blue-700) 30%, transparent)",
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
                stroke: "color-mix(in srgb, var(--color-blue-700) 30%, transparent)",
                roughness: 0.8,
                strokeWidth: 1.3,
              }}
            >
              <StarIcon
                className="size-6 text-amber-400 -rotate-12"
                roughConfig={{ fill: "var(--color-amber-200)", fillStyle: "solid" }}
              />
            </RoughBox>
            <RoughBox
              className="h-23"
              padding={8}
              containerClassName="flex items-center justify-center"
              roughConfig={{
                fill: "color-mix(in srgb, var(--color-rose-100) 55%, transparent)",
                fillStyle: "solid",
                stroke: "color-mix(in srgb, var(--color-blue-700) 30%, transparent)",
                roughness: 0.8,
                strokeWidth: 1.3,
              }}
            >
              <TulipIcon
                className="size-6 text-pink-400"
                roughConfig={{ roughness: 0.15, strokeWidth: 0.6, fill: "var(--color-rose-300)" }}
              />
            </RoughBox>
            <RoughBox
              className="h-23"
              padding={8}
              containerClassName="flex items-center justify-center"
              roughConfig={{
                fill: "color-mix(in srgb, var(--color-green-100) 55%, transparent)",
                fillStyle: "solid",
                stroke: "color-mix(in srgb, var(--color-blue-700) 30%, transparent)",
                roughness: 0.8,
                strokeWidth: 1.3,
              }}
            >
              <LeafIcon
                className="size-6 text-green-500 rotate-y-180"
                roughConfig={{ fill: "var(--color-green-300)", fillStyle: "solid" }}
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
            roughConfig={{ fill: "var(--color-yellow-200)", fillStyle: "solid" }}
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

export const IntroBookPage5 = forwardRef<HTMLDivElement, IntroBookPageProps>(
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
            roughConfig={{ fill: "var(--color-yellow-200)", fillStyle: "solid" }}
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
            roughConfig={{ fill: "var(--color-purple-200)", fillStyle: "solid" }}
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

export function IntroBookPages(side?: "left" | "right"): React.ReactNode[] {
  return [
    <BookPageScale key="intro-page-1">
      <IntroBookPage1 side={side} />
    </BookPageScale>,
    <BookPageScale key="intro-page-2">
      <IntroBookPage2 side={side} />
    </BookPageScale>,
    <BookPageScale key="intro-page-3">
      <IntroBookPage3 side={side} />
    </BookPageScale>,
    <BookPageScale key="intro-page-4">
      <IntroBookPage4 side={side} />
    </BookPageScale>,
    <BookPageScale key="intro-page-5">
      <IntroBookPage5 side={side} />
    </BookPageScale>,
  ];
}
