"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function completeOnboarding(data: {
  role: string
  interests: string[]
  bio?: string
  experienceLevel: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  try {
    // Update profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        role: data.role,
        interests: data.interests,
        bio: data.bio,
        experience_level: data.experienceLevel,
        onboarding_completed: true,
      })
      .eq("id", user.id)

    if (updateError) throw updateError

    // Track onboarding steps
    await supabase.from("onboarding_progress").insert([
      { user_id: user.id, step_completed: "role" },
      { user_id: user.id, step_completed: "interests" },
      { user_id: user.id, step_completed: "profile" },
    ])

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to complete onboarding" }
  }
}

export async function skipOnboarding() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  try {
    const { error } = await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", user.id)

    if (error) throw error

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to skip onboarding" }
  }
}
