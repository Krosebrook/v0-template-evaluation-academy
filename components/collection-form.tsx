"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase/client"

interface Collection {
  id: string
  name: string
  description?: string
  is_public: boolean
}

export function CollectionForm({
  collection,
}: {
  collection?: Collection
}) {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: collection?.name || "",
    description: collection?.description || "",
    is_public: collection?.is_public ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      if (collection) {
        // Update existing collection
        const { error } = await supabase
          .from("collections")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", collection.id)

        if (error) throw error
        router.push(`/collections/${collection.id}`)
      } else {
        // Create new collection
        const { data, error } = await supabase
          .from("collections")
          .insert({
            ...formData,
            user_id: user.id,
          })
          .select()
          .single()

        if (error) throw error
        router.push(`/collections/${data.id}`)
      }
    } catch (error) {
      console.error("Error saving collection:", error)
      alert("Failed to save collection")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Collection Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="My Awesome Templates"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="A curated collection of..."
            rows={4}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="is_public">Public Collection</Label>
            <p className="text-sm text-muted-foreground">Allow others to view and follow this collection</p>
          </div>
          <Switch
            id="is_public"
            checked={formData.is_public}
            onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : collection ? "Update" : "Create"} Collection
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
