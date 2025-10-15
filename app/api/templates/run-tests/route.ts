import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const templateId = formData.get("templateId") as string

  if (!templateId) {
    return NextResponse.json({ error: "Template ID required" }, { status: 400 })
  }

  // Fetch template
  const { data: template } = await supabase.from("templates").select("*").eq("id", templateId).single()

  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 })
  }

  // Create test records
  const testTypes = ["lighthouse", "accessibility", "security", "links", "code_quality"]

  for (const testType of testTypes) {
    await supabase.from("template_tests").insert({
      template_id: templateId,
      test_type: testType,
      status: "pending",
    })
  }

  // In a real implementation, you would trigger background jobs here
  // For now, we'll simulate test results
  setTimeout(async () => {
    const { data: pendingTests } = await supabase
      .from("template_tests")
      .select("*")
      .eq("template_id", templateId)
      .eq("status", "pending")

    for (const test of pendingTests || []) {
      // Simulate test execution
      const score = Math.floor(Math.random() * 40) + 60 // Random score 60-100
      const passed = score >= 70

      await supabase
        .from("template_tests")
        .update({
          status: passed ? "passed" : "failed",
          score,
          results: {
            details: `Simulated ${test.test_type} test results`,
            timestamp: new Date().toISOString(),
          },
        })
        .eq("id", test.id)
    }
  }, 2000)

  return NextResponse.redirect(new URL(`/templates/${templateId}/tests`, request.url))
}
