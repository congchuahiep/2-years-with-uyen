"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import type { FillStyle } from "@/shared/types/rough";
import { cn } from "@/shared/utils/cn";

interface RoughBuntingProps {
  className?: string;
  /** Chiều cao của dây cờ (px). Mặc định 56. */
  height?: number;
  /** Số lá cờ — mặc định tự tính theo chiều rộng (~1 cờ / 70px). */
  flagsCount?: number;
  /** Chiều cao lá cờ (px) — mặc định tự tính theo chiều cao dây. */
  flagHeight?: number;
  /** Độ võng của dây (px) — càng lớn dây càng cong. Mặc định 18. */
  sag?: number;
  /** Bảng màu các lá cờ (CSS variables) — mặc định 7 màu pastel. */
  colors?: string[];
  /** Màu sợi dây. Mặc định nâu nhạt. */
  ropeColor?: string;
  roughConfig?: Options & { fillStyle?: FillStyle };
}

// Bảng màu pastel theo theme CSS variables của repo
const DEFAULT_COLORS = [
  "var(--color-red-300)",
  "var(--color-yellow-300)",
  "var(--color-green-300)",
  "var(--color-pink-300)",
  "var(--color-purple-300)",
  "var(--color-sky-300)",
  "var(--color-amber-300)",
];

/**
 * Dây cờ nheo (bunting flag) vẽ tay bằng Rough.js — 1 dây võng + nhiều lá cờ
 * tam giác đủ màu treo dọc xuống. Co giãn theo chiều rộng container
 * (ResizeObserver), tự tính số cờ nếu không truyền `flagsCount`.
 */
const RoughBunting = ({
  className,
  height = 56,
  flagsCount,
  flagHeight,
  sag = 18,
  colors = DEFAULT_COLORS,
  ropeColor = "var(--color-amber-600)",
  roughConfig = {},
}: RoughBuntingProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isDrawn, setIsDrawn] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setSize({ width: offsetWidth, height: offsetHeight });
      }
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Stringify để làm dependency (tránh vẽ lại vô ích khi parent re-render)
  const configStr = JSON.stringify(roughConfig);
  const colorsStr = JSON.stringify(colors);

  useEffect(() => {
    if (!svgRef.current || size.width === 0) return;

    while (svgRef.current.firstChild) {
      svgRef.current.removeChild(svgRef.current.firstChild);
    }

    const parsedConfig = JSON.parse(configStr);
    const parsedColors = JSON.parse(colorsStr) as string[];
    const rc = rough.svg(svgRef.current);

    const options: Options = {
      roughness: 1.2,
      strokeWidth: 1.5,
      fillStyle: "solid",
      ...parsedConfig,
    };

    const w = size.width;
    const ropeY = 6; // vị trí dây tính từ đỉnh
    const n = flagsCount ?? Math.max(3, Math.floor(w / 70));
    const sagPx = sag;
    const flagH = flagHeight ?? Math.max(20, size.height - ropeY - 10);

    // y của dây tại t (0..1) — khớp chính xác với quadratic bezier M 0 Q w/2 w 0
    const ropeYAt = (t: number) => ropeY + sagPx * 2 * t * (1 - t);

    // 1. Các lá cờ (vẽ trước, để dây đè lên đỉnh cờ sau)
    const flagNodes: SVGGElement[] = [];
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : 0.1 + (0.8 * i) / (n - 1);
      const x = t * w;
      const yTop = ropeYAt(t);
      const flagW = Math.min(48, (w * 0.72) / n);
      const color = parsedColors[i % parsedColors.length];

      // Viền cờ = đúng màu cờ nhưng nhạt hơn (pha 60% màu gốc + 40% trắng)
      const strokeColor = `color-mix(in srgb, ${color} 60%, white)`;

      const flag = rc.polygon(
        [
          [x - flagW / 2, yTop + 1],
          [x + flagW / 2, yTop + 1],
          [x, yTop + flagH],
        ],
        {
          ...options,
          fill: color,
          stroke: strokeColor,
          strokeWidth: 1,
        },
      );
      flagNodes.push(flag);
    }
    flagNodes.forEach((node) => {
      svgRef.current?.appendChild(node);
    });

    // 2. Sợi dây (vẽ sau → đè lên đỉnh cờ, trông như cờ treo vào dây)
    const ropeNode = rc.path(
      `M 0 ${ropeY} Q ${w / 2} ${ropeY + sagPx} ${w} ${ropeY}`,
      {
        ...options,
        fill: "transparent",
        stroke: ropeColor,
        strokeWidth: 1.5,
      },
    );
    svgRef.current.appendChild(ropeNode);

    if (!isDrawn) {
      requestAnimationFrame(() => setIsDrawn(true));
    }
  }, [
    configStr,
    colorsStr,
    size.width,
    size.height,
    isDrawn,
    flagsCount,
    flagHeight,
    sag,
    ropeColor,
  ]);

  return (
    <div
      ref={containerRef}
      style={{ height: `${height}px` }}
      className={cn(
        "relative w-full transition-opacity duration-300",
        !isDrawn ? "opacity-0" : "opacity-100",
        className,
      )}
    >
      <svg
        ref={svgRef}
        width={size.width}
        height={size.height}
        className="absolute top-0 left-0 pointer-events-none -z-10 overflow-visible"
      />
    </div>
  );
};

export default RoughBunting;
