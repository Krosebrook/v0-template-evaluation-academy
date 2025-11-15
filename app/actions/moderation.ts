"use server"

import { revalidatePath } from "next/cache"
import { getAuthenticatedUser } from "@/lib/auth/server-auth"

export async function reportContent(
  contentId: string,
  contentType: "template" | "comment" | "user",
  reason: string,
  description?: string,
) {
  const { supabase, user, error: authError } = await getAuthenticatedUser()
  if (authError || !user) {
    return { success: false, error: authError || "Not authenticated" }
  }

  const { error } = await supabase.from("reports").insert({
    content_id: contentId,
    content_type: contentType,
    reporter_id: user.id,
    reason,
    description,
    status: "pending",
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Report error:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function blockUser(userId: string, reason: string) {
  const { supabase, user, error: authError } = await getAuthenticatedUser()
  if (authError || !user) {
    return { success: false, error: authError || "Not authenticated" }
  }

  const { error } = await supabase.from("blocked_users").insert({
    blocker_id: user.id,
    blocked_id: userId,
    reason,
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Block user error:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  return { success: true }
}

export async function moderateContent(reportId: string, action: "approve" | "remove" | "warn", notes?: string) {
  const { supabase, user, error: authError } = await getAuthenticatedUser()
  if (authError || !user) {
    return { success: false, error: authError || "Not authenticated" }
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    return { success: false, error: "Not authorized" }
  }

  const { data: report, error: fetchError } = await supabase.from("reports").select("*").eq("id", reportId).single()

  if (fetchError || !report) {
    return { success: false, error: "Report not found" }
  }

  // Update report status
  const { error: updateError } = await supabase
    .from("reports")
    .update({
      status: action === "approve" ? "resolved" : "actioned",
      moderator_id: user.id,
      moderator_notes: notes,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", reportId)

  if (updateError) {
    console.error("Moderate error:", updateError)
    return { success: false, error: updateError.message }
  }

  // Take action on content
  if (action === "remove") {
    if (report.content_type === "template") {
      await supabase.from("templates").update({ status: "removed" }).eq("id", report.content_id)
    } else if (report.content_type === "comment") {
      await supabase.from("comments").update({ deleted: true }).eq("id", report.content_id)
    }
  }

  revalidatePath("/admin")
  return { success: true }
}
