import { type NextRequest, NextResponse } from "next/server";
import { searchDeezer } from "@/features/music/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ data: [] });
  }

  try {
    return NextResponse.json({ data: await searchDeezer(query) });
  } catch (error) {
    console.error("Deezer Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from Deezer API" },
      { status: 500 },
    );
  }
}
