"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import { cn } from "@/shared/utils/cn";

interface LeafIconProps {
  className?: string;
  roughConfig?: Options;
}

export default function LeafIcon({
  className,
  roughConfig = {},
}: LeafIconProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawn, setIsDrawn] = useState(false);

  const configStr = JSON.stringify(roughConfig);

  useEffect(() => {
    if (!svgRef.current) return;

    while (svgRef.current.firstChild) {
      svgRef.current.removeChild(svgRef.current.firstChild);
    }

    const rc = rough.svg(svgRef.current);
    const parsedConfig = JSON.parse(configStr);

    const options: Options = {
      roughness: 0.2,
      strokeWidth: 1,
      stroke: "currentColor",
      ...parsedConfig,
    };

    // Hình chiếc lá (scale + translate từ path gốc 1024x1024 về viewBox 24x24,
    // padding ~1 đơn vị để tránh rough.js tràn mép).
    const leafPath =
      "M 8.48 9.25 c -0.79 -0.41 -2.71 -4.12 -3.22 -3.72 s -0.76 2.14 0.01 3.21 2.47 1.82 2.88 2.43 0.35 1.07 0.25 1.18 S 4.95 10.07 4.11 10.51 s -0.53 1.59 0.33 2.48 S 8.04 13.62 8.57 14.02 s 0.61 1.03 0.38 1.03 -2.73 -0.61 -3.61 -0.45 -1.28 0.75 0.00 1.38 3.38 0.17 3.74 0.53 0.13 0.53 -0.14 0.55 -2.06 -0.09 -2.70 0.00 0.12 1.05 0.44 1.30 1.51 0.36 1.85 0.30 0.69 -0.50 0.96 -0.38 0.06 0.86 0.15 0.99 0.88 0.17 0.99 -0.00 -0.19 -0.71 -0.00 -0.96 0.61 0.21 1.24 -0.02 2.04 -1.32 2.08 -1.95 -2.48 0.52 -3.13 0.50 c -0.46 -0.07 -0.65 -0.40 -0.36 -0.57 s 4.28 -1.04 4.58 -1.80 0.07 -0.65 -0.40 -0.65 S 11.38 14.99 11.10 14.53 14.86 12.85 15.28 11.83 s 0.55 -2.24 -0.00 -2.39 -2.77 2.59 -3.65 2.45 -0.02 -0.40 0.36 -0.90 2.48 -2.26 2.50 -2.89 0.19 -1.26 -0.52 -1.34 -2.42 2.55 -2.81 2.32 0.99 -1.47 1.20 -2.70 S 11.88 3.90 11.50 3.98 s -0.36 0.08 -0.36 0.42 0.19 1.49 -0.03 2.14 -0.25 1.13 -0.44 1.01 -0.19 -0.82 -0.08 -1.38 0.44 -1.74 0.24 -2.10 S 10.25 2.32 8.80 2.69 s -1.35 1.68 -1.22 2.56 0.52 1.57 0.85 2.41 0.41 1.78 0.05 1.59 z";

    const leafNode = rc.path(leafPath, {
      fill: "var(--color-green-300)",
      fillStyle: "solid",
      ...options,
    });

    svgRef.current.appendChild(leafNode);

    if (!isDrawn) {
      requestAnimationFrame(() => setIsDrawn(true));
    }
  }, [configStr, isDrawn]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 24 24"
      className={cn(
        "w-6 h-6 overflow-visible inline-block transition-opacity duration-300",
        !isDrawn ? "opacity-0" : "opacity-100",
        className,
      )}
    />
  );
}
