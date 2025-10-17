import { createServerClient } from "./server"
import { createBrowserClient } from "./client"

// Server-side database operations
export async function getTemplates(filters?: {
  category?: string
  difficulty?: string
  search?: string
  limit?: number
  offset?: number
}) {
  const supabase = createServerClient()

  let query = supabase
    .from("templates")
    .select(`
      *,
      profiles:submitted_by (
        display_name,
        avatar_url
      ),
      evaluations (
        overall_score
      )
    `)
    .order("created_at", { ascending: false })

  if (filters?.category) {
    query = query.eq("category", filters.category)
  }

  if (filters?.difficulty) {
    query = query.eq("difficulty", filters.difficulty)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getTemplateById(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("templates")
    .select(`
      *,
      profiles:submitted_by (
        display_name,
        avatar_url,
        bio
      ),
      evaluations (
        *,
        profiles:evaluator_id (
          display_name,
          avatar_url
        )
      )
    `)
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function createTemplate(template: {
  title: string
  description: string
  category: string
  difficulty: string
  tags: string[]
  preview_url?: string
  github_url?: string
  demo_url?: string
  submitted_by: string
}) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("templates").insert(template).select().single()

  if (error) throw error
  return data
}

export async function updateTemplate(
  id: string,
  updates: Partial<{
    title: string
    description: string
    category: string
    difficulty: string
    tags: string[]
    preview_url: string
    github_url: string
    demo_url: string
  }>,
) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("templates")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTemplate(id: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("templates").delete().eq("id", id)

  if (error) throw error
}

// Generation (formerly evaluation) operations
export async function createGeneration(generation: {
  template_id: string
  evaluator_id: string
  code_quality_score: number
  design_score: number
  functionality_score: number
  documentation_score: number
  performance_score: number
  overall_score: number
  feedback: string
}) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("evaluations").insert(generation).select().single()

  if (error) throw error
  return data
}

export async function getGenerationsByTemplate(templateId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("evaluations")
    .select(`
      *,
      profiles:evaluator_id (
        display_name,
        avatar_url
      )
    `)
    .eq("template_id", templateId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getGenerationsByUser(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("evaluations")
    .select(`
      *,
      templates (
        title,
        category
      )
    `)
    .eq("evaluator_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// Profile operations
export async function getProfile(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}

export async function updateProfile(
  userId: string,
  updates: Partial<{
    display_name: string
    bio: string
    avatar_url: string
    role: string
  }>,
) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Client-side database operations (for use in client components)
export function useSupabaseClient() {
  return createBrowserClient()
}
