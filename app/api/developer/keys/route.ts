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

  const { keyName } = await request.json()

  if (!keyName) {
    return NextResponse.json({ error: "Key name required" }, { status: 400 })
  }

  // Generate API key
  const apiKey = `tea_${randomBytes(32).toString("hex")}`

  const { error } = await supabase.from("api_keys").insert({
    user_id: user.id,
    key_name: keyName,
    api_key: apiKey,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
