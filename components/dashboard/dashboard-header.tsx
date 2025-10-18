"use client"

import { Button } from "@/components/ui/button"
import { Settings, Bell, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DashboardHeaderProps {
  user: {
    id: string
    email?: string
  }
  profile: {
    display_name?: string
    avatar_url?: string
    role?: string
  } | null
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const displayName = profile?.display_name || user.email?.split("@")[0] || "User"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome back, {displayName}</h1>
        <p className="text-muted-foreground">Here's what's happening with your templates today.</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search templates..." className="pl-9 w-[300px]" />
        </div>

        <Button variant="ghost" size="icon" asChild>
          <Link href="/notifications">
            <Bell className="h-5 w-5" />
          </Link>
        </Button>

        <Button variant="ghost" size="icon" asChild>
          <Link href="/profile/settings">
            <Settings className="h-5 w-5" />
          </Link>
        </Button>

        <Avatar className="h-9 w-9">
          <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={displayName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
