"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { TrendingUp, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PlatformActivityWidgetProps {
  data: {
    recentTemplates: Array<{
      id: string
      title: string
      created_at: string
      profiles: {
        display_name?: string
        avatar_url?: string
      } | null
    }>
  }
}

export function PlatformActivityWidget({ data }: PlatformActivityWidgetProps) {
  return (
    <Card className="p-6 glass">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Platform Activity</h2>
      </div>
      <div className="space-y-3">
        {data.recentTemplates && data.recentTemplates.length > 0 ? (
          data.recentTemplates.slice(0, 4).map((template) => (
            <div
              key={template.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={template.profiles?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{template.profiles?.display_name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{template.title}</p>
                <p className="text-xs text-muted-foreground">
                  by {template.profiles?.display_name || "Unknown"} •{" "}
                  {new Date(template.created_at).toLocaleDateString()}
                </p>
              </div>
              <Link href={`/templates/results/${template.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
        )}
      </div>
    </Card>
  )
}
