"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, UserPlus, UserX, FileText, Settings, Trash2 } from "lucide-react"

interface WorkspaceActivityItem {
  id: string
  action: string
  details: any
  created_at: string
  profiles: {
    username: string
    avatar_url?: string
  }
}

interface WorkspaceActivityProps {
  activities: WorkspaceActivityItem[] | null
}

const getActivityIcon = (action: string) => {
  switch (action) {
    case "workspace_created":
      return <Settings className="h-5 w-5 text-blue-500" />
    case "member_invited":
      return <UserPlus className="h-5 w-5 text-green-500" />
    case "member_removed":
      return <UserX className="h-5 w-5 text-red-500" />
    case "template_added":
      return <FileText className="h-5 w-5 text-purple-500" />
    case "template_removed":
      return <Trash2 className="h-5 w-5 text-orange-500" />
    default:
      return <Activity className="h-5 w-5 text-gray-500" />
  }
}

const getActivityDescription = (action: string, details: any, username: string) => {
  switch (action) {
    case "workspace_created":
      return `${username} created the workspace`
    case "member_invited":
      return `${username} invited ${details.email} as ${details.role}`
    case "member_removed":
      return `${username} removed a member from the workspace`
    case "template_added":
      return `${username} added a template to the workspace`
    case "template_removed":
      return `${username} removed a template from the workspace`
    default:
      return `${username} performed an action`
  }
}

export function WorkspaceActivity({ activities }: WorkspaceActivityProps) {
  if (!activities || activities.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Activity Yet</h3>
        <p className="text-muted-foreground">
          Workspace activity will appear here as members collaborate
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <Card key={activity.id} className="p-4">
          <div className="flex items-start gap-4">
            <div className="mt-0.5">{getActivityIcon(activity.action)}</div>
            <div className="flex-1">
              <p className="text-sm">
                {getActivityDescription(
                  activity.action,
                  activity.details,
                  activity.profiles?.username || "Unknown user"
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(activity.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
