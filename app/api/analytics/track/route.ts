import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { error } = await supabase.from("analytics_events").insert({
      event: body.event,
      properties: body.properties,
      user_id: body.userId,
      created_at: body.timestamp || new Date().toISOString(),
    })

    if (error) {
      console.error("[v0] Analytics insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Analytics API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
