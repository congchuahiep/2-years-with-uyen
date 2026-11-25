import type { Metadata } from "next";
import "@/styles/globals.css";
import MuteButton from "@/shared/components/MuteButton";
import { corinthia, fuzzyBubbles, pangolin } from "@/configs/font";
import AudioPreloaderProvider from "@/shared/providers/AudioPreloaderProvider";
import ModalContentWrapper from "@/shared/providers/ModalContentWrapper";
import ModalProvider from "@/shared/providers/ModalProvider";

export const metadata: Metadata = {
  title: "2 năm cùng nhau",
  description: "Dự án kỉ niệm đặc bịc của Hiệp và Uyên",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fuzzyBubbles.variable} ${pangolin.variable} ${corinthia.variable}`}
    >
      <body className={`antialiased bg-purple-400 overflow-hidden`}>
        <AudioPreloaderProvider>
          <ModalProvider>
            <ModalContentWrapper>
              <MuteButton className="fixed bottom-4 left-4 z-50" />
              {children}
            </ModalContentWrapper>
          </ModalProvider>
        </AudioPreloaderProvider>
      </body>
    </html>
  );
}
