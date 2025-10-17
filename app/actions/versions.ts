"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTemplateVersion(data: {
  templateId: string
  versionNumber: string
  title: string
  description?: string
  content: string
  changelog?: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  try {
    // Check if user owns the template
    const { data: template } = await supabase
      .from("templates")
      .select("author_id, version_count")
      .eq("id", data.templateId)
      .single()

    if (!template || template.author_id !== user.id) {
      return { error: "Unauthorized" }
    }

    // Mark all previous versions as not current
    await supabase.from("template_versions").update({ is_current: false }).eq("template_id", data.templateId)

    // Create new version
    const { error: versionError } = await supabase.from("template_versions").insert({
      template_id: data.templateId,
      version_number: data.versionNumber,
      title: data.title,
      description: data.description,
      content: data.content,
      changelog: data.changelog,
      created_by: user.id,
      is_current: true,
    })

    if (versionError) throw versionError

    // Update template
    const { error: updateError } = await supabase
      .from("templates")
      .update({
        name: data.title,
        description: data.description,
        content: data.content,
        current_version: data.versionNumber,
        version_count: (template.version_count || 1) + 1,
      })
      .eq("id", data.templateId)

    if (updateError) throw updateError

    revalidatePath(`/templates/${data.templateId}`)
    revalidatePath(`/templates/${data.templateId}/versions`)

    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create version" }
  }
}
