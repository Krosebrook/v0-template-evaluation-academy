"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import type { TemplateAnalytics, AnalyticsData } from "@/types/analytics"

interface TemplatePerformanceTableProps {
  templates: TemplateAnalytics[]
  analytics: AnalyticsData[]
}

export function TemplatePerformanceTable({ templates, analytics }: TemplatePerformanceTableProps) {
  if (!templates || templates.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No templates available
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {templates.map((template) => {
        const templateAnalytics = analytics.filter((a) => a.template_id === template.id)
        const views = templateAnalytics.reduce((sum, a) => sum + (a.views || 0), 0)
        const generations = templateAnalytics.reduce((sum, a) => sum + (a.generations || 0), 0)
        const avgRating =
          templateAnalytics.length > 0
            ? templateAnalytics.reduce((sum, a) => sum + (a.avg_rating || 0), 0) /
              templateAnalytics.length
            : 0

        // Calculate performance score (0-100)
        const performanceScore = Math.min(
          100,
          Math.round((views * 0.3 + generations * 0.5 + avgRating * 10) / 3)
        )

        return (
          <div key={template.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <Link 
                  href={`/templates/${template.id}`}
                  className="font-medium hover:underline"
                >
                  {template.name || template.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(template.created_at).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={performanceScore >= 70 ? "default" : "secondary"}>
                Score: {performanceScore}
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-medium">{views}</span>
                </div>
                <Progress value={Math.min(100, views / 10)} />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Generations</span>
                  <span className="font-medium">{generations}</span>
                </div>
                <Progress value={Math.min(100, generations / 5)} />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Average Rating</span>
                  <span className="font-medium">{avgRating.toFixed(1)}/10</span>
                </div>
                <Progress value={avgRating * 10} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
