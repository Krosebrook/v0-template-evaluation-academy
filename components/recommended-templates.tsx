"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"

interface Template {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  preview_image?: string
}

interface SimilarTemplateResult {
  templates: Template
}

export function RecommendedTemplates({ userId }: { userId?: string }) {
  const [recommendations, setRecommendations] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createBrowserClient(), [])

  const loadTrendingTemplates = useCallback(async () => {
    // Get templates with most recent interactions
    const { data: trending } = await supabase
      .from("templates")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6)

    if (trending) {
      setRecommendations(trending)
    }
  }, [supabase])

  const loadRecommendations = useCallback(async () => {
    try {
      if (userId) {
        // Get personalized recommendations based on user behavior
        const { data: userInteractions } = await supabase
          .from("user_interactions")
          .select("template_id, interaction_type")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10)

        if (userInteractions && userInteractions.length > 0) {
          // Get templates similar to ones user has interacted with
          const templateIds = userInteractions.map((i) => i.template_id)
          const { data: similarTemplates } = await supabase
            .from("template_similarities")
            .select("similar_template_id, templates!template_similarities_similar_template_id_fkey(*)")
            .in("template_id", templateIds)
            .order("similarity_score", { ascending: false })
            .limit(6)

          if (similarTemplates) {
            setRecommendations(similarTemplates.map((s: SimilarTemplateResult) => s.templates))
          }
        } else {
          // New user - show trending templates
          await loadTrendingTemplates()
        }
      } else {
        // Not logged in - show trending templates
        await loadTrendingTemplates()
      }
    } catch (error) {
      console.error("[v0] Error loading recommendations:", error)
      await loadTrendingTemplates()
    } finally {
      setLoading(false)
    }
  }, [userId, supabase, loadTrendingTemplates])

  useEffect(() => {
    loadRecommendations()
  }, [loadRecommendations])

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-4" />
            <div className="h-3 bg-muted rounded w-full mb-2" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </Card>
        ))}
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-semibold mb-2">No recommendations yet</h3>
        <p className="text-sm text-muted-foreground">Start exploring templates to get personalized recommendations</p>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendations.map((template) => (
        <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold line-clamp-1">{template.title}</h3>
            <Sparkles className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{template.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{template.category}</Badge>
            <Badge variant="outline">{template.difficulty}</Badge>
          </div>
          <Button asChild className="w-full">
            <Link href={`/templates/${template.id}`}>View Template</Link>
          </Button>
        </Card>
      ))}
    </div>
  )
}
