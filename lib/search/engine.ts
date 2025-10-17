import { createClient } from "@/lib/supabase/server"

export interface SearchFilters {
  query?: string
  categories?: string[]
  tags?: string[]
  minScore?: number
  maxScore?: number
  dateFrom?: string
  dateTo?: string
  author?: string
  sortBy?: "relevance" | "score" | "date" | "popular"
  page?: number
  limit?: number
}

export async function searchTemplates(filters: SearchFilters) {
  const supabase = await createClient()
  const {
    query = "",
    categories = [],
    tags = [],
    minScore,
    maxScore,
    dateFrom,
    dateTo,
    author,
    sortBy = "relevance",
    page = 1,
    limit = 20,
  } = filters

  let queryBuilder = supabase.from("templates").select("*, profiles(username, avatar_url)", { count: "exact" })

  if (query) {
    queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
  }

  if (categories.length > 0) {
    queryBuilder = queryBuilder.in("category", categories)
  }

  if (tags.length > 0) {
    queryBuilder = queryBuilder.contains("tags", tags)
  }

  if (minScore !== undefined) {
    queryBuilder = queryBuilder.gte("average_score", minScore)
  }
  if (maxScore !== undefined) {
    queryBuilder = queryBuilder.lte("average_score", maxScore)
  }

  if (dateFrom) {
    queryBuilder = queryBuilder.gte("created_at", dateFrom)
  }
  if (dateTo) {
    queryBuilder = queryBuilder.lte("created_at", dateTo)
  }

  if (author) {
    queryBuilder = queryBuilder.eq("author_id", author)
  }

  switch (sortBy) {
    case "score":
      queryBuilder = queryBuilder.order("average_score", { ascending: false })
      break
    case "date":
      queryBuilder = queryBuilder.order("created_at", { ascending: false })
      break
    case "popular":
      queryBuilder = queryBuilder.order("view_count", { ascending: false })
      break
    default:
      // Relevance sorting (default)
      queryBuilder = queryBuilder.order("created_at", { ascending: false })
  }

  const offset = (page - 1) * limit
  queryBuilder = queryBuilder.range(offset, offset + limit - 1)

  const { data, error, count } = await queryBuilder

  if (error) {
    console.error("[v0] Search error:", error)
    return { templates: [], total: 0, error: error.message }
  }

  return {
    templates: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

export async function getSearchSuggestions(query: string, limit = 5) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("templates").select("name, id").ilike("name", `%${query}%`).limit(limit)

  if (error) {
    console.error("[v0] Suggestions error:", error)
    return []
  }

  return data || []
}

export async function saveSearchPreferences(userId: string, filters: SearchFilters) {
  const supabase = await createClient()

  const { error } = await supabase.from("user_preferences").upsert({
    user_id: userId,
    search_filters: filters,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error("[v0] Save preferences error:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getSearchPreferences(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user_preferences")
    .select("search_filters")
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("[v0] Get preferences error:", error)
    return null
  }

  return data?.search_filters as SearchFilters | null
}
