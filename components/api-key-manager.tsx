"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Key, Copy, Trash2, Plus } from "lucide-react"

interface ApiKey {
  id: string
  key_name: string
  api_key: string
  is_active: boolean
  last_used_at: string | null
  created_at: string
}

interface ApiKeyManagerProps {
  apiKeys: ApiKey[]
  userId: string
}

export function ApiKeyManager({ apiKeys, userId }: ApiKeyManagerProps) {
  const [keyName, setKeyName] = useState("")
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    setCreating(true)
    try {
      const response = await fetch("/api/developer/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyName, userId }),
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error("Failed to create API key:", error)
    } finally {
      setCreating(false)
    }
  }

  const handleCopy = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey)
  }

  const handleDelete = async (keyId: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) return

    try {
      await fetch(`/api/developer/keys/${keyId}`, { method: "DELETE" })
      window.location.reload()
    } catch (error) {
      console.error("Failed to delete API key:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Create New API Key</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="key-name">Key Name</Label>
            <Input
              id="key-name"
              placeholder="Production API Key"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
            />
          </div>
          <Button onClick={handleCreate} disabled={creating || !keyName}>
            <Plus className="mr-2 h-4 w-4" />
            Create API Key
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {apiKeys.map((key) => (
          <Card key={key.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5" />
                <div>
                  <h4 className="font-semibold">{key.key_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(key.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge variant={key.is_active ? "default" : "secondary"}>{key.is_active ? "Active" : "Inactive"}</Badge>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <code className="flex-1 p-2 bg-muted rounded text-sm">{key.api_key}</code>
              <Button size="sm" variant="outline" onClick={() => handleCopy(key.api_key)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(key.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {key.last_used_at && (
              <p className="text-xs text-muted-foreground">Last used: {new Date(key.last_used_at).toLocaleString()}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
