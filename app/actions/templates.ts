"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createTemplate, updateTemplate, deleteTemplate } from "@/lib/supabase/database"
import { getAuthenticatedUser } from "@/lib/auth/server-auth"

export async function submitTemplate(formData: FormData) {
  const { user, error } = await getAuthenticatedUser()

  if (error || !user) {
    return { error: error || "You must be logged in to submit a template" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const difficulty = formData.get("difficulty") as string
  const tags = (formData.get("tags") as string).split(",").map((t) => t.trim())
  const preview_url = formData.get("preview_url") as string
  const github_url = formData.get("github_url") as string
  const demo_url = formData.get("demo_url") as string

  try {
    const template = await createTemplate({
      title,
      description,
      category,
      difficulty,
      tags,
      preview_url,
      github_url,
      demo_url,
      submitted_by: user.id,
    })

    revalidatePath("/templates")
    revalidatePath("/browse")

    return { success: true, template }
  } catch (error) {
    console.error("[v0] Error creating template:", error)
    return { error: "Failed to create template" }
  }
}

export async function updateTemplateAction(id: string, formData: FormData) {
  const { user, error } = await getAuthenticatedUser()

  if (error || !user) {
    return { error: error || "You must be logged in" }
  }

  const updates = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    difficulty: formData.get("difficulty") as string,
    tags: (formData.get("tags") as string).split(",").map((t) => t.trim()),
    preview_url: formData.get("preview_url") as string,
    github_url: formData.get("github_url") as string,
    demo_url: formData.get("demo_url") as string,
  }

  try {
    const template = await updateTemplate(id, updates)

    revalidatePath(`/templates/${id}`)
    revalidatePath("/templates")

    return { success: true, template }
  } catch (error) {
    console.error("[v0] Error updating template:", error)
    return { error: "Failed to update template" }
  }
}

export async function deleteTemplateAction(id: string) {
  const { user, error } = await getAuthenticatedUser()

  if (error || !user) {
    return { error: error || "You must be logged in" }
  }

  try {
    await deleteTemplate(id)

    revalidatePath("/templates")
    revalidatePath("/browse")

    redirect("/templates")
  } catch (error) {
    console.error("[v0] Error deleting template:", error)
    return { error: "Failed to delete template" }
  }
}
