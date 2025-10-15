import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
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

  // Update last used
  await supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", keyData.id)

  // Log API usage
  const startTime = Date.now()

  // Fetch templates
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Math.min(Number.parseInt(searchParams.get("limit") || "10"), 100)
  const category = searchParams.get("category")

  let query = supabase.from("templates").select("*", { count: "exact" }).eq("status", "approved")

  if (category) {
    query = query.eq("category", category)
  }

  const {
    data: templates,
    count,
    error,
  } = await query.range((page - 1) * limit, page * limit - 1).order("created_at", { ascending: false })

  const responseTime = Date.now() - startTime

  // Log usage
  await supabase.from("api_usage").insert({
    api_key_id: keyData.id,
    endpoint: "/api/v1/templates",
    method: "GET",
    status_code: error ? 500 : 200,
    response_time_ms: responseTime,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data: templates,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil((count || 0) / limit),
    },
  })
}
