"use client"

import { Card } from "@/components/ui/card"
import { Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface NotificationsWidgetProps {
  data: {
    notifications: Array<{
      id: string
      title: string
      message: string
      created_at: string
      type: string
    }>
  }
}

export function NotificationsWidget({ data }: NotificationsWidgetProps) {
  return (
    <Card className="p-6 glass">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        {data.notifications && data.notifications.length > 0 && (
          <Button variant="ghost" size="sm">
            <Check className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {data.notifications && data.notifications.length > 0 ? (
          data.notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-3 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <p className="font-medium text-sm">{notification.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-2">{new Date(notification.created_at).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No new notifications</p>
          </div>
        )}
        {data.notifications && data.notifications.length > 0 && (
          <Link
            href="/notifications"
            className="flex items-center justify-center text-sm font-medium hover:underline pt-2"
          >
            View all notifications
          </Link>
        )}
      </div>
    </Card>
  )
}
