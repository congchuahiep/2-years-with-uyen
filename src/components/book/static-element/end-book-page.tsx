"use client";

import { forwardRef } from "react";
import { BlankBookPage } from "../blank-book-page";

export const EndBookPage = forwardRef<
  HTMLDivElement,
  { side?: "left" | "right" }
>(({ side = "left" }, ref) => {
  return <BlankBookPage ref={ref} side={side}></BlankBookPage>;
});

EndBookPage.displayName = "EndBookPage";
