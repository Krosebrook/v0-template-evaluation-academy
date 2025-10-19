"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, FileText, Award, Settings, BarChart3, BookOpen, Layers, Bot, Zap } from "lucide-react"

interface QuickActionsWidgetProps {
  data: {
    profile: { role?: string } | null
  }
}

export function QuickActionsWidget({ data }: QuickActionsWidgetProps) {
  const isAdmin = data.profile?.role === "admin"
  const isEvaluator = data.profile?.role === "evaluator" || isAdmin

  const actions = [
    { label: "Generate Template", href: "/generator", icon: Layers, variant: "default" as const },
    { label: "GPT Builder", href: "/gpt-generator", icon: Bot, variant: "outline" as const },
    { label: "Claude Skills", href: "/claude-skill-generator", icon: Zap, variant: "outline" as const },
    { label: "Browse Templates", href: "/templates", icon: FileText, variant: "outline" as const },
    ...(isEvaluator
      ? [{ label: "Evaluate", href: "/templates?filter=pending", icon: Award, variant: "outline" as const }]
      : []),
    ...(isAdmin ? [{ label: "Admin Panel", href: "/admin", icon: Settings, variant: "outline" as const }] : []),
    { label: "Analytics", href: "/analytics/overview", icon: BarChart3, variant: "outline" as const },
    { label: "Training", href: "/training", icon: BookOpen, variant: "outline" as const },
  ]

  return (
    <Card className="p-6 glass">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button key={action.label} asChild variant={action.variant} className="h-auto py-4 flex-col gap-2">
              <Link href={action.href}>
                <Icon className="h-5 w-5" />
                <span className="text-sm">{action.label}</span>
              </Link>
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
