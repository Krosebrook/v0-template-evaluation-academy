"use client"

import { Card } from "@/components/ui/card"
import { FileText, Award, Users, TrendingUp } from "lucide-react"

interface StatsWidgetProps {
  data: {
    stats: {
      templates: number
      evaluations: number
      users: number
    }
  }
}

export function StatsWidget({ data }: StatsWidgetProps) {
  const stats = [
    {
      label: "Total Templates",
      value: data.stats.templates,
      icon: FileText,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      label: "Evaluations",
      value: data.stats.evaluations,
      icon: Award,
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      label: "Team Members",
      value: data.stats.users,
      icon: Users,
      change: "+3",
      changeType: "positive" as const,
    },
    {
      label: "Avg. Quality Score",
      value: "8.4",
      icon: TrendingUp,
      change: "+0.3",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-6 glass hover-lift">
            <div className="flex items-center justify-between mb-4">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span
                className={`text-xs font-medium ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}
              >
                {stat.change}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
