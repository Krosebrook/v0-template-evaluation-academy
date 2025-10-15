"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Webhook, Trash2, Plus } from "lucide-react"

interface WebhookData {
  id: string
  url: string
  events: string[]
  is_active: boolean
  last_triggered_at: string | null
  created_at: string
}

interface WebhookManagerProps {
  webhooks: WebhookData[]
  userId: string
}

const availableEvents = [
  { id: "template.created", label: "Template Created" },
  { id: "template.updated", label: "Template Updated" },
  { id: "evaluation.completed", label: "Evaluation Completed" },
  { id: "comment.created", label: "Comment Created" },
]

export function WebhookManager({ webhooks, userId }: WebhookManagerProps) {
  const [url, setUrl] = useState("")
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    setCreating(true)
    try {
      const response = await fetch("/api/developer/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, events: selectedEvents, userId }),
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error("Failed to create webhook:", error)
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (webhookId: string) => {
    if (!confirm("Are you sure you want to delete this webhook?")) return

    try {
      await fetch(`/api/developer/webhooks/${webhookId}`, { method: "DELETE" })
      window.location.reload()
    } catch (error) {
      console.error("Failed to delete webhook:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Create New Webhook</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              placeholder="https://your-app.com/webhooks"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div>
            <Label>Events</Label>
            <div className="space-y-2 mt-2">
              {availableEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-2">
                  <Checkbox
                    id={event.id}
                    checked={selectedEvents.includes(event.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedEvents([...selectedEvents, event.id])
                      } else {
                        setSelectedEvents(selectedEvents.filter((e) => e !== event.id))
                      }
                    }}
                  />
                  <Label htmlFor={event.id} className="font-normal cursor-pointer">
                    {event.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleCreate} disabled={creating || !url || selectedEvents.length === 0}>
            <Plus className="mr-2 h-4 w-4" />
            Create Webhook
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Webhook className="h-5 w-5" />
                <div>
                  <h4 className="font-semibold break-all">{webhook.url}</h4>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(webhook.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={webhook.is_active ? "default" : "secondary"}>
                  {webhook.is_active ? "Active" : "Inactive"}
                </Badge>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(webhook.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {webhook.events.map((event) => (
                <Badge key={event} variant="outline">
                  {event}
                </Badge>
              ))}
            </div>

            {webhook.last_triggered_at && (
              <p className="text-xs text-muted-foreground">
                Last triggered: {new Date(webhook.last_triggered_at).toLocaleString()}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
