import type React from "react";
import { forwardRef } from "react";
import type { Options } from "roughjs/bin/core";
import type { FillStyle } from "@/shared/types/rough";
import { cn } from "@/shared/utils/cn";
import RoughBox from "./RoughBox";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  roughConfig?: Options & { fillStyle?: FillStyle };
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, roughConfig, ...props }, ref) => {
    return (
      <RoughBox
        padding={0}
        roughConfig={{ roughness: 0.8, strokeWidth: 2, ...roughConfig }}
      >
        <div className="p-3">
          <select
            className={cn(
              "w-full bg-transparent text-lg outline-none transition-all appearance-none cursor-pointer",
              "px-1",
              className,
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
        </div>
      </RoughBox>
    );
  },
);

Select.displayName = "Select";

export default Select;
