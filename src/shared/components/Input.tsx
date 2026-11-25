import type { Options } from "roughjs/bin/core";
import type { FillStyle } from "@/shared/types/rough";
import { cn } from "@/shared/utils/cn";
import RoughBox from "./RoughBox";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  roughConfig?: Options & { fillStyle?: FillStyle };
}

export default function Input({
  className,
  roughConfig,
  ...props
}: InputProps) {
  return (
    <RoughBox
      padding={0}
      roughConfig={{ roughness: 0.8, strokeWidth: 2, ...roughConfig }}
    >
      <div className="p-3">
        <input
          {...props}
          className={cn(
            "w-full bg-transparent text-lg outline-none transition-all",
            "placeholder:text-foreground/50 px-1",
            className,
          )}
        />
      </div>
    </RoughBox>
  );
}
