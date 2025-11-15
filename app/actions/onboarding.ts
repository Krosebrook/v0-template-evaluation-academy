"use server"

import { revalidatePath } from "next/cache"
import { getAuthenticatedUser } from "@/lib/auth/server-auth"

export async function completeOnboarding(data: {
  role: string
  interests: string[]
  bio?: string
  experienceLevel: string
}) {
  const { supabase, user, error } = await getAuthenticatedUser()

  if (error || !user) {
    return { error: error || "Not authenticated" }
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
  const { supabase, user, error } = await getAuthenticatedUser()

  if (error || !user) {
    return { error: error || "Not authenticated" }
  }

  try {
    const { error: updateError } = await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", user.id)

    if (updateError) throw updateError

    revalidatePath("/profile")
    return { success: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to skip onboarding" }
  }
}
