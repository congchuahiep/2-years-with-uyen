import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("q");

	if (!query) {
		return NextResponse.json({ data: [] });
	}

	try {
		// Gọi trực tiếp đến Deezer API từ Server-side (không bị CORS)
		const response = await axios.get(
			`https://api.deezer.com/search?q=${encodeURIComponent(query)}`,
		);

		return NextResponse.json(response.data);
	} catch (error) {
		console.error("Deezer Proxy Error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch from Deezer API" },
			{ status: 500 },
		);
	}
}
