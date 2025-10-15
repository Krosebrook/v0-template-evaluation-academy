import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { randomBytes } from "crypto"

export async function POST(request: Request) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { url, events } = await request.json()

  if (!url || !events || events.length === 0) {
    return NextResponse.json({ error: "URL and events required" }, { status: 400 })
  }

  // Generate webhook secret
  const secret = randomBytes(32).toString("hex")

  const { error } = await supabase.from("webhooks").insert({
    user_id: user.id,
    url,
    events,
    secret,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
