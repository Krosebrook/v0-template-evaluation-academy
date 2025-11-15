"use server"

import { revalidatePath } from "next/cache"
import { createGeneration } from "@/lib/supabase/database"
import { getAuthenticatedUser } from "@/lib/auth/server-auth"

export async function submitGeneration(formData: FormData) {
  const { supabase, user, error } = await getAuthenticatedUser()

  if (error || !user) {
    return { error: error || "You must be logged in to generate" }
  }

  // Check if user has generator role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || !["evaluator", "admin"].includes(profile.role)) {
    return { error: "You must be a certified generator to submit generations" }
  }

  const template_id = formData.get("template_id") as string
  const code_quality_score = Number.parseInt(formData.get("code_quality_score") as string)
  const design_score = Number.parseInt(formData.get("design_score") as string)
  const functionality_score = Number.parseInt(formData.get("functionality_score") as string)
  const documentation_score = Number.parseInt(formData.get("documentation_score") as string)
  const performance_score = Number.parseInt(formData.get("performance_score") as string)
  const feedback = formData.get("feedback") as string

  const overall_score = Math.round(
    (code_quality_score + design_score + functionality_score + documentation_score + performance_score) / 5,
  )

  try {
    const generation = await createGeneration({
      template_id,
      evaluator_id: user.id,
      code_quality_score,
      design_score,
      functionality_score,
      documentation_score,
      performance_score,
      overall_score,
      feedback,
    })

    revalidatePath(`/templates/${template_id}`)
    revalidatePath(`/templates/generate/${template_id}`)

    return { success: true, generation }
  } catch (error) {
    console.error("[v0] Error creating generation:", error)
    return { error: "Failed to create generation. You may have already generated this template." }
  }
}
