import type { Metadata } from "next";
import { logout } from "@/features/auth";
import { Book } from "@/features/book";

export const metadata: Metadata = {
	title: "Sổ kỷ niệm",
	description: "Cuốn sổ lật lưu giữ kỷ niệm của Hiệp và Uyên",
};

export default function HomePage() {
	return (
		<main className="relative flex h-screen flex-col items-center justify-center gap-4 overflow-hidden px-4 py-6">
			<Book pages={[]} />
			<form action={logout} className="absolute right-4 bottom-4">
				<button
					type="submit"
					className="text-sm font-bold text-purple-100/80 hover:text-purple-100"
				>
					Đăng xuất
				</button>
			</form>
		</main>
	);
}
