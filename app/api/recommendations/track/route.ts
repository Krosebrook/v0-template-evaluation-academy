import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { templateId, interactionType } = await request.json()

    // Optimized: Batch operations - fetch template and preferences in parallel
    const [interactionResult, templateResult, preferencesResult] = await Promise.allSettled([
      supabase.from("user_interactions").insert({
        user_id: user.id,
        template_id: templateId,
        interaction_type: interactionType,
      }),
      supabase.from("templates").select("category, difficulty").eq("id", templateId).single(),
      supabase.from("user_preferences").select("*").eq("user_id", user.id).single(),
    ])

    // Handle template and preferences updates if template fetch succeeded
    if (templateResult.status === "fulfilled" && templateResult.value.data) {
      const template = templateResult.value.data
      const preferences = preferencesResult.status === "fulfilled" ? preferencesResult.value.data : null

      if (preferences) {
        // Update existing preferences only if needed
        const categories = preferences.preferred_categories || []
        const difficulties = preferences.preferred_difficulties || []

        const needsUpdate =
          !categories.includes(template.category) || !difficulties.includes(template.difficulty)

        if (needsUpdate) {
          if (!categories.includes(template.category)) {
            categories.push(template.category)
          }
          if (!difficulties.includes(template.difficulty)) {
            difficulties.push(template.difficulty)
          }

          await supabase
            .from("user_preferences")
            .update({
              preferred_categories: categories,
              preferred_difficulties: difficulties,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.id)
        }
      } else {
        // Create new preferences
        await supabase.from("user_preferences").insert({
          user_id: user.id,
          preferred_categories: [template.category],
          preferred_difficulties: [template.difficulty],
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Recommendation tracking error:", error)
    return NextResponse.json({ error: "Failed to track interaction" }, { status: 500 })
  }
}
