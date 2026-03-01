import type React from "react";
import { forwardRef } from "react";
import type { Options } from "roughjs/bin/core";
import type { FillStyle } from "@/types/rough";
import cn from "@/utils/cn";
import { RoughBox } from "./rough-box";

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	roughConfig?: Options & { fillStyle?: FillStyle };
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, roughConfig, ...props }, ref) => {
		return (
			<RoughBox
				padding={0}
				roughConfig={{ roughness: 0.8, strokeWidth: 2, ...roughConfig }}
			>
				<div className="p-3">
					<textarea
						className={cn(
							"w-full bg-transparent text-lg outline-none transition-all resize-none min-h-[120px]",
							"placeholder:text-foreground/50 px-1",
							className,
						)}
						ref={ref}
						{...props}
					/>
				</div>
			</RoughBox>
		);
	},
);

Textarea.displayName = "Textarea";
