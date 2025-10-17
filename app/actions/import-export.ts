"use server"

import { createClient } from "@/lib/supabase/server"
import { parseCSV, parseJSON, generateJSON } from "@/lib/import-export/parser"
import { revalidatePath } from "next/cache"

export async function importTemplates(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const file = formData.get("file") as File
  if (!file) {
    return { success: false, error: "No file provided" }
  }

  try {
    let templates
    const fileType = file.name.split(".").pop()?.toLowerCase()

    if (fileType === "csv") {
      templates = await parseCSV(file)
    } else if (fileType === "json") {
      templates = await parseJSON(file)
    } else {
      return { success: false, error: "Unsupported file type. Use CSV or JSON." }
    }

    const { data: importJob, error: jobError } = await supabase
      .from("import_jobs")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_type: fileType,
        total_templates: templates.length,
        status: "processing",
      })
      .select()
      .single()

    if (jobError) throw jobError

    let successful = 0
    let failed = 0
    const errors: any[] = []

    for (const template of templates) {
      const { error } = await supabase.from("templates").insert({
        ...template,
        author_id: user.id,
        status: "draft",
      })

      if (error) {
        failed++
        errors.push({ template: template.name, error: error.message })
      } else {
        successful++
      }
    }

    await supabase
      .from("import_jobs")
      .update({
        processed_templates: templates.length,
        successful_imports: successful,
        failed_imports: failed,
        status: "completed",
        error_log: errors.length > 0 ? errors : null,
        completed_at: new Date().toISOString(),
      })
      .eq("id", importJob.id)

    revalidatePath("/templates")

    return {
      success: true,
      imported: successful,
      failed,
      errors: errors.length > 0 ? errors : undefined,
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function exportTemplates(templateIds?: string[]) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    let query = supabase.from("templates").select("*").eq("author_id", user.id)

    if (templateIds && templateIds.length > 0) {
      query = query.in("id", templateIds)
    }

    const { data: templates, error } = await query

    if (error) throw error

    const json = generateJSON(templates || [])

    return {
      success: true,
      data: json,
      count: templates?.length || 0,
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createBackup() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    const { data: templates } = await supabase.from("templates").select("*").eq("author_id", user.id)

    const backupData = {
      version: "1.0",
      created_at: new Date().toISOString(),
      templates: templates || [],
    }

    const json = JSON.stringify(backupData, null, 2)
    const blob = new Blob([json], { type: "application/json" })

    await supabase.from("backups").insert({
      user_id: user.id,
      backup_type: "manual",
      file_url: "local",
      template_count: templates?.length || 0,
      file_size_bytes: blob.size,
    })

    return {
      success: true,
      data: json,
      count: templates?.length || 0,
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
