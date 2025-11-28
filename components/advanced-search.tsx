"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Filter, X, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createBrowserClient } from "@/lib/supabase/client"
import { TemplateCard } from "@/components/template-card"

interface SearchFilters {
  query: string
  category: string
  difficulty: string
  minScore: number
  maxScore: number
  sortBy: string
  sortOrder: "asc" | "desc"
}

interface Evaluation {
  overall_score?: number
  code_quality?: number
  documentation?: number
  usability?: number
  innovation?: number
  performance?: number
  maintainability?: number
}

interface SearchTemplate {
  id: string
  title: string
  description?: string
  category?: string
  difficulty?: string
  status?: string
  evaluations?: Evaluation[]
  averageScore?: number
  evaluationCount?: number
}

export function AdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "all",
    difficulty: "all",
    minScore: 0,
    maxScore: 10,
    sortBy: "created_at",
    sortOrder: "desc",
  })
  const [templates, setTemplates] = useState<SearchTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(true)
  const [savedSearches, setSavedSearches] = useState<SearchFilters[]>([])

  const searchTemplates = useCallback(async () => {
    setLoading(true)
    const supabase = createBrowserClient()

    try {
      let query = supabase
        .from("templates")
        .select(
          `
          *,
          evaluations(
            overall_score,
            code_quality,
            documentation,
            usability,
            innovation,
            performance,
            maintainability
          )
        `,
        )
        .eq("status", "approved")

      // Apply text search
      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`)
      }

      // Apply category filter
      if (filters.category !== "all") {
        query = query.eq("category", filters.category)
      }

      // Apply difficulty filter
      if (filters.difficulty !== "all") {
        query = query.eq("difficulty", filters.difficulty)
      }

      // Apply sorting
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === "asc" })

      const { data, error } = await query

      if (error) throw error

      // Calculate average scores and filter by score range
      const templatesWithScores = (data || []).map((template: SearchTemplate) => {
        const evaluations = template.evaluations || []
        const avgScore =
          evaluations.length > 0
            ? evaluations.reduce((sum: number, e: Evaluation) => sum + (e.overall_score || 0), 0) / evaluations.length
            : 0

        return {
          ...template,
          averageScore: avgScore,
          evaluationCount: evaluations.length,
        }
      })

      // Filter by score range
      const filtered = templatesWithScores.filter(
        (t) => (t.averageScore ?? 0) >= filters.minScore && (t.averageScore ?? 0) <= filters.maxScore,
      )

      setTemplates(filtered)
    } catch (error) {
      console.error("Error searching templates:", error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    searchTemplates()
  }, [searchTemplates])

  const saveSearch = () => {
    const saved = [...savedSearches, filters]
    setSavedSearches(saved)
    localStorage.setItem("savedSearches", JSON.stringify(saved))
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "all",
      difficulty: "all",
      minScore: 0,
      maxScore: 10,
      sortBy: "created_at",
      sortOrder: "desc",
    })
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates by name or description..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline" onClick={saveSearch}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="landing-page">Landing Page</SelectItem>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="e-commerce">E-commerce</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={filters.difficulty}
                onValueChange={(value) => setFilters({ ...filters, difficulty: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date Added</SelectItem>
                  <SelectItem value="title">Name</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <Label>Order</Label>
              <Select
                value={filters.sortOrder}
                onValueChange={(value: "asc" | "desc") => setFilters({ ...filters, sortOrder: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Score Range */}
            <div className="space-y-2 md:col-span-2">
              <Label>
                Score Range: {filters.minScore} - {filters.maxScore}
              </Label>
              <Slider
                min={0}
                max={10}
                step={0.5}
                value={[filters.minScore, filters.maxScore]}
                onValueChange={([min, max]) => setFilters({ ...filters, minScore: min, maxScore: max })}
                className="mt-2"
              />
            </div>

            {/* Clear Filters */}
            <div className="flex items-end md:col-span-2">
              <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Active Filters */}
      {(filters.query || filters.category !== "all" || filters.difficulty !== "all") && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.query && (
            <Badge variant="secondary">
              Search: {filters.query}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setFilters({ ...filters, query: "" })} />
            </Badge>
          )}
          {filters.category !== "all" && (
            <Badge variant="secondary">
              Category: {filters.category}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setFilters({ ...filters, category: "all" })} />
            </Badge>
          )}
          {filters.difficulty !== "all" && (
            <Badge variant="secondary">
              Difficulty: {filters.difficulty}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => setFilters({ ...filters, difficulty: "all" })}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">{loading ? "Searching..." : `${templates.length} templates found`}</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No templates found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
