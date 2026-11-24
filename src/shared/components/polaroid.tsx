import { tv, type VariantProps } from "tailwind-variants";
import { RoughBox } from "@/shared/components/rough-box";
import cn from "@/shared/utils/cn";

const polaroidVariants = tv({
	slots: {
		root: "shadow-md mix-blend-normal transition-all duration-300 relative",
		container: "",
		content: "relative scale-90 size-full",
		caption: "px-3 font-bold line-clamp-1 text-xs text-foreground",
	},
	variants: {
		isLandscape: {
			true: {
				container: "flex",
				root: "aspect-4/3 w-75",
				content: "h-full w-[90%]",
				caption: "[writing-mode:sideways-lr]",
			},
			false: {
				root: "aspect-3/4 w-55",
        content: "h-[90%] w-full",
				caption: "-mt-1",
			},
		},
		size: {
			xs: {
				caption: "-mt-1",
			},
			sm: {},
			default: {},
		},
	},
	compoundVariants: [
		{
			isLandscape: true,
			size: "xs",
			class: { root: "w-40" },
		},
		{
			isLandscape: false,
			size: "xs",
			class: { root: "w-40" },
		},
		{
			isLandscape: true,
			size: "sm",
			class: { root: "w-64" },
		},
		{
			isLandscape: false,
			size: "sm",
			class: { root: "w-48" },
		},
	],
	defaultVariants: {
		isLandscape: false,
		size: "default",
	},
});

export function Polaroid({
	className,
	isLandscape = false,
	size = "default",
	style,
	children,
	text,
}: {
	size?: VariantProps<typeof polaroidVariants>["size"];
	className?: string;
	isLandscape?: boolean;
	style?: React.CSSProperties;
	text?: string;
	children?: React.ReactNode;
}) {
	const { root, content, caption, container } = polaroidVariants({
		isLandscape,
		size,
	});

	return (
		<RoughBox
			padding={0}
			roughConfig={{
				roughness: 1.5,
				strokeWidth: 1.5,
				fill: "white",
				fillStyle: "solid",
			}}
			className={cn(root(), className)}
			style={style}
			containerClassName={container()}
		>
			<div className={content()}>{children}</div>
			<div className={caption()}>{text}</div>
		</RoughBox>
	);
}
