"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { WorkspaceTemplate } from "@/types/workspace"

interface WorkspaceTemplatesProps {
  templates: WorkspaceTemplate[] | null
  workspaceId: string
  canManage: boolean
}

export function WorkspaceTemplates({ templates, workspaceId, canManage }: WorkspaceTemplatesProps) {
  if (!templates || templates.length === 0) {
    return (
      <Card className="p-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Templates Yet</h3>
        <p className="text-muted-foreground mb-4">
          Add templates to this workspace to collaborate with your team
        </p>
        <Link href={`/templates/submit?workspace=${workspaceId}`}>
          <Button>Add Your First Template</Button>
        </Link>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/10 text-green-500"
      case "draft":
        return "bg-yellow-500/10 text-yellow-500"
      case "archived":
        return "bg-gray-500/10 text-gray-500"
      default:
        return "bg-blue-500/10 text-blue-500"
    }
  }

  return (
    <div className="space-y-4">
      {templates.map((item) => (
        <Card key={item.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold">{item.templates.title}</h3>
                <Badge className={getStatusColor(item.templates.status)}>
                  {item.templates.status}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-3">{item.templates.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Created {new Date(item.templates.created_at).toLocaleDateString()}
                </span>
                <span>
                  Added to workspace {new Date(item.added_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/templates/${item.template_id}`}>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </Button>
              </Link>
              {canManage && (
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
