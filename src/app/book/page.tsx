import type { Metadata } from "next";
import BookView from "./view";

export const metadata: Metadata = {
	title: "Sổ kỷ niệm",
	description: "Cuốn sổ lật lưu giữ kỷ niệm của Hiệp và Uyên",
};

export default async function BookPage() {
	return (
		<main className="relative flex h-screen flex-col items-center justify-center gap-4 overflow-hidden px-4 py-6">
			<BookView />
		</main>
	);
}
