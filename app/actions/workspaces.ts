"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createWorkspace(data: { name: string; description?: string }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  try {
    // Create workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .insert({
        name: data.name,
        description: data.description,
        owner_id: user.id,
      })
      .select()
      .single()

    if (workspaceError) throw workspaceError

    // Add creator as owner
    const { error: memberError } = await supabase.from("workspace_members").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: "owner",
    })

    if (memberError) throw memberError

    // Log activity
    await supabase.from("workspace_activity").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      action: "workspace_created",
      details: { name: data.name },
    })

    revalidatePath("/workspaces")
    return { success: true, workspaceId: workspace.id }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create workspace" }
  }
}

export async function inviteToWorkspace(data: { workspaceId: string; email: string; role: string }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  try {
    // Check if user has permission to invite
    const { data: member } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", data.workspaceId)
      .eq("user_id", user.id)
      .single()

    if (!member || (member.role !== "owner" && member.role !== "admin")) {
      return { error: "Unauthorized" }
    }

    // Create invitation
    const { error: inviteError } = await supabase.from("workspace_invitations").insert({
      workspace_id: data.workspaceId,
      email: data.email,
      role: data.role,
      invited_by: user.id,
    })

    if (inviteError) throw inviteError

    // Log activity
    await supabase.from("workspace_activity").insert({
      workspace_id: data.workspaceId,
      user_id: user.id,
      action: "member_invited",
      details: { email: data.email, role: data.role },
    })

    revalidatePath(`/workspaces/${data.workspaceId}/members`)
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to send invitation" }
  }
}

export async function removeFromWorkspace(data: { workspaceId: string; userId: string }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  try {
    // Check if user has permission
    const { data: member } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", data.workspaceId)
      .eq("user_id", user.id)
      .single()

    if (!member || (member.role !== "owner" && member.role !== "admin")) {
      return { error: "Unauthorized" }
    }

    // Remove member
    const { error: removeError } = await supabase
      .from("workspace_members")
      .delete()
      .eq("workspace_id", data.workspaceId)
      .eq("user_id", data.userId)

    if (removeError) throw removeError

    // Log activity
    await supabase.from("workspace_activity").insert({
      workspace_id: data.workspaceId,
      user_id: user.id,
      action: "member_removed",
      details: { removed_user_id: data.userId },
    })

    revalidatePath(`/workspaces/${data.workspaceId}/members`)
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to remove member" }
  }
}
