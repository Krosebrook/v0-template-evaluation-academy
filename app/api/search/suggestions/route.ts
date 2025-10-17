import { type NextRequest, NextResponse } from "next/server"
import { getSearchSuggestions } from "@/lib/search/engine"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  const suggestions = await getSearchSuggestions(query)
  return NextResponse.json(suggestions)
}
