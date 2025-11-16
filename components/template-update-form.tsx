"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { CATEGORIES, DIFFICULTIES } from "@/lib/constants/templates"
import { addTag as addTagUtil, removeTag as removeTagUtil } from "@/lib/utils/tags"

interface Template {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  tags: string[]
  preview_image: string
  github_url: string
  demo_url: string
  version: number
}

export function TemplateUpdateForm({ template }: { template: Template }) {
  const [formData, setFormData] = useState({
    title: template.title,
    description: template.description,
    category: template.category,
    difficulty: template.difficulty,
    tags: template.tags || [],
    preview_image: template.preview_image || "",
    github_url: template.github_url || "",
    demo_url: template.demo_url || "",
    changelog: "",
  })
  const [newTag, setNewTag] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const { data, error: rpcError } = await supabase.rpc("create_template_version", {
        p_template_id: template.id,
        p_title: formData.title,
        p_description: formData.description,
        p_category: formData.category,
        p_difficulty: formData.difficulty,
        p_tags: formData.tags,
        p_preview_image: formData.preview_image,
        p_github_url: formData.github_url,
        p_demo_url: formData.demo_url,
        p_changelog: formData.changelog,
      })

      if (rpcError) throw rpcError

      router.push(`/templates/results/${template.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update template")
    } finally {
      setSubmitting(false)
    }
  }

  const addTag = () => {
    const newTags = addTagUtil(formData.tags, newTag)
    if (newTags.length > formData.tags.length) {
      setFormData({ ...formData, tags: newTags })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: removeTagUtil(formData.tags, tagToRemove) })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Version</CardTitle>
        <CardDescription>
          Current version: v{template.version}. This will create v{template.version + 1}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Template Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              maxLength={500}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty *</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((diff) => (
                    <SelectItem key={diff} value={diff}>
                      {diff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add a tag"
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preview_image">Preview Image URL</Label>
            <Input
              id="preview_image"
              type="url"
              value={formData.preview_image}
              onChange={(e) => setFormData({ ...formData, preview_image: e.target.value })}
              placeholder="https://example.com/image.png"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub Repository URL</Label>
            <Input
              id="github_url"
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo_url">Live Demo URL</Label>
            <Input
              id="demo_url"
              type="url"
              value={formData.demo_url}
              onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
              placeholder="https://demo.example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="changelog">Changelog *</Label>
            <Textarea
              id="changelog"
              value={formData.changelog}
              onChange={(e) => setFormData({ ...formData, changelog: e.target.value })}
              required
              placeholder="Describe what changed in this version..."
              rows={4}
            />
          </div>

          {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">{error}</div>}

          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? "Creating Version..." : "Create New Version"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
