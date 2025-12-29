"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, ExternalLink, Eye, Star } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Template {
  id: string
  title: string
  description: string
  author_id: string
  created_at: string
  status: string
  profiles?: {
    username: string
    avatar_url?: string
  }
}

interface CollectionTemplateGridProps {
  templates: Template[]
  collectionId: string
  canManage: boolean
}

export function CollectionTemplateGrid({ templates, collectionId, canManage }: CollectionTemplateGridProps) {
  const [localTemplates, setLocalTemplates] = useState(templates)

  const handleRemove = async (templateId: string) => {
    if (!confirm("Remove this template from the collection?")) return

    try {
      const response = await fetch(`/api/collections/${collectionId}/templates/${templateId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to remove template")

      setLocalTemplates(localTemplates.filter((t) => t.id !== templateId))
      toast.success("Template removed from collection")
    } catch (error) {
      toast.error("Failed to remove template")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/10 text-green-500"
      case "draft":
        return "bg-yellow-500/10 text-yellow-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {localTemplates.map((template) => (
        <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <Badge className={getStatusColor(template.status)}>{template.status}</Badge>
            {canManage && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => handleRemove(template.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <h3 className="text-xl font-semibold mb-2 line-clamp-2">{template.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{template.description}</p>

          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {template.profiles?.username && (
                <>
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                    {template.profiles.username[0].toUpperCase()}
                  </div>
                  <span>@{template.profiles.username}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/templates/${template.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
            <Link href={`/templates/${template.id}`}>
              <Button size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  )
}
