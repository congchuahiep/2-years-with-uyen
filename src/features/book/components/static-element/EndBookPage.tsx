"use client";

import { forwardRef } from "react";
import BlankBookPage from "../BlankBookPage";

const EndBookPage = forwardRef<HTMLDivElement, { side?: "left" | "right" }>(
  ({ side = "left" }, ref) => {
    return <BlankBookPage ref={ref} side={side}></BlankBookPage>;
  },
);

EndBookPage.displayName = "EndBookPage";
export default EndBookPage;
