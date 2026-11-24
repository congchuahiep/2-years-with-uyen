import { type NextRequest, NextResponse } from "next/server";
import { fetchDeezer } from "@/features/music/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { search } = new URL(request.url);
	const { path } = await params;

	try {
		return NextResponse.json(await fetchDeezer(path, search));
	} catch (error) {
		console.error("Deezer Proxy Error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch from Deezer API" },
			{ status: 500 },
		);
	}
}
