"use client"

import { useOnlineUsers } from "@/lib/supabase/realtime"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

export function OnlineIndicator() {
  const onlineUsers = useOnlineUsers()

  return (
    <Badge variant="secondary" className="gap-2">
      <Users className="h-3 w-3" />
      <span className="text-xs">{onlineUsers.length} online</span>
    </Badge>
  )
}
