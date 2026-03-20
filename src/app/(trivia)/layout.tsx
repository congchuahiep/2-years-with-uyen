import { BinderPaper } from "@/components/ui/binder-paper";

export default function TriviaLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-screen justify-center items-center">
			<BinderPaper className="w-xl h-48">{children}</BinderPaper>
		</div>
	);
}
