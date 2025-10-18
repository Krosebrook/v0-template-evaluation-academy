"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Clock, FileText, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RecentActivityWidgetProps {
  data: {
    userTemplates: Array<{
      id: string
      title: string
      category: string
      created_at: string
    }>
  }
}

export function RecentActivityWidget({ data }: RecentActivityWidgetProps) {
  return (
    <Card className="p-6 glass">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Your Recent Activity</h2>
      </div>
      <div className="space-y-3">
        {data.userTemplates && data.userTemplates.length > 0 ? (
          data.userTemplates.slice(0, 3).map((template) => (
            <Link
              key={template.id}
              href={`/templates/results/${template.id}`}
              className="block p-3 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{template.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{template.category}</p>
                </div>
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">No templates yet. Create your first one!</p>
            <Button asChild size="sm">
              <Link href="/generator">Generate Template</Link>
            </Button>
          </div>
        )}
        {data.userTemplates && data.userTemplates.length > 3 && (
          <Link
            href="/templates?filter=my-templates"
            className="flex items-center justify-center gap-2 text-sm font-medium hover:underline pt-2"
          >
            View all templates
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </Card>
  )
}
