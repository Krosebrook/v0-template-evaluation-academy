"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, UserX, Shield, Mail } from "lucide-react"
import { removeFromWorkspace } from "@/app/actions/workspaces"
import { toast } from "sonner"
import type { WorkspaceMember } from "@/types/workspace"

interface WorkspaceMembersProps {
  members: WorkspaceMember[] | null
  workspaceId: string
  currentUserRole: string
}

export function WorkspaceMembers({ members, workspaceId, currentUserRole }: WorkspaceMembersProps) {
  const [localMembers, setLocalMembers] = useState(members || [])
  const canManageMembers = currentUserRole === "owner" || currentUserRole === "admin"

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return

    const result = await removeFromWorkspace({ workspaceId, userId })

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Member removed successfully")
      setLocalMembers(localMembers.filter((m) => m.user_id !== userId))
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-500/10 text-purple-500"
      case "admin":
        return "bg-blue-500/10 text-blue-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  if (!localMembers || localMembers.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Members Yet</h3>
        <p className="text-muted-foreground">Invite team members to collaborate</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {localMembers.map((member) => (
        <Card key={member.user_id} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold">
                {member.profiles?.username?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">
                    {member.profiles?.display_name || member.profiles?.username || "Unknown User"}
                  </h3>
                  <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">@{member.profiles?.username}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Joined {new Date(member.joined_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            {canManageMembers && member.role !== "owner" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleRemoveMember(member.user_id)}
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Remove from Workspace
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
