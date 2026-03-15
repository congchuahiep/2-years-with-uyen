import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { search } = new URL(request.url);
	const { path } = await params;
	const url = path.join("/");

	try {
		const response = await axios.get(`https://api.deezer.com/${url}${search}`);

		return NextResponse.json(response.data);
	} catch (error) {
		console.error("Deezer Proxy Error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch from Deezer API" },
			{ status: 500 },
		);
	}
}
