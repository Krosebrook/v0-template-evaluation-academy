"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatsWidget } from "./widgets/stats-widget"
import { QuickActionsWidget } from "./widgets/quick-actions-widget"
import { RecentActivityWidget } from "./widgets/recent-activity-widget"
import { PlatformActivityWidget } from "./widgets/platform-activity-widget"
import { NotificationsWidget } from "./widgets/notifications-widget"
import { GPTGeneratorWidget } from "./widgets/gpt-generator-widget"
import { ClaudeSkillWidget } from "./widgets/claude-skill-widget"
import { GripVertical, Plus } from "lucide-react"

interface DashboardWidgetsProps {
  data: {
    user: { id: string; email?: string }
    profile: { role?: string } | null
    stats: { templates: number; evaluations: number; users: number }
    userTemplates: unknown[]
    userEvaluations: unknown[]
    recentTemplates: unknown[]
    notifications: unknown[]
  }
}

export function DashboardWidgets({ data }: DashboardWidgetsProps) {
  const [widgets, setWidgets] = useState([
    { id: "stats", component: StatsWidget, enabled: true, size: "full" },
    { id: "quick-actions", component: QuickActionsWidget, enabled: true, size: "half" },
    { id: "recent-activity", component: RecentActivityWidget, enabled: true, size: "half" },
    { id: "gpt-generator", component: GPTGeneratorWidget, enabled: true, size: "half" },
    { id: "claude-skill", component: ClaudeSkillWidget, enabled: true, size: "half" },
    { id: "notifications", component: NotificationsWidget, enabled: true, size: "half" },
    { id: "platform-activity", component: PlatformActivityWidget, enabled: true, size: "half" },
  ])

  return (
    <div className="space-y-6">
      {/* Stats Row - Always Full Width */}
      <StatsWidget data={data} />

      {/* Customizable Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActionsWidget data={data} />
        <RecentActivityWidget data={data} />
        <GPTGeneratorWidget />
        <ClaudeSkillWidget />
        <NotificationsWidget data={data} />
        <PlatformActivityWidget data={data} />
      </div>

      {/* Widget Customization Hint */}
      <Card className="p-4 glass border-dashed">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GripVertical className="h-4 w-4" />
            <span>Drag and drop widgets to customize your dashboard (coming soon)</span>
          </div>
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </Card>
    </div>
  )
}
