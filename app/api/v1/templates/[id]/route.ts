import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const apiKey = request.headers.get("x-api-key")

  if (!apiKey) {
    return NextResponse.json({ error: "API key required" }, { status: 401 })
  }

  const supabase = await createServerClient()

  // Verify API key
  const { data: keyData } = await supabase
    .from("api_keys")
    .select("*")
    .eq("api_key", apiKey)
    .eq("is_active", true)
    .single()

  if (!keyData) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
  }

  // Fetch template with evaluations
  const { data: template, error } = await supabase
    .from("templates")
    .select(
      `
      *,
      evaluations (
        id,
        overall_score,
        created_at
      )
    `,
    )
    .eq("id", params.id)
    .eq("status", "approved")
    .single()

  if (error || !template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 })
  }

  // Log usage
  await supabase.from("api_usage").insert({
    api_key_id: keyData.id,
    endpoint: `/api/v1/templates/${params.id}`,
    method: "GET",
    status_code: 200,
    response_time_ms: 0,
  })

  return NextResponse.json({ data: template })
}
