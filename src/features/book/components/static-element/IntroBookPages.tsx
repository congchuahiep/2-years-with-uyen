"use client";

import type { ReactNode } from "react";
import BookPageScale from "../BookPageScale";
import IntroBookPage1 from "./IntroBookPage1";
import IntroBookPage2 from "./IntroBookPage2";
import IntroBookPage3 from "./IntroBookPage3";
import IntroBookPage4 from "./IntroBookPage4";
import IntroBookPage5 from "./IntroBookPage5";

export default function IntroBookPages(side?: "left" | "right"): ReactNode[] {
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
