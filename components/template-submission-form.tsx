"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, X, Plus, Check, AlertCircle } from "lucide-react"
import { CATEGORIES, DIFFICULTIES, COMMON_TAGS } from "@/lib/constants/templates"
import { addTag, removeTag } from "@/lib/utils/tags"

export function TemplateSubmissionForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [demoUrl, setDemoUrl] = useState("")

  const handleAddTag = (tag: string) => {
    setTags(addTag(tags, tag))
  }

  const handleRemoveTag = (tag: string) => {
    setTags(removeTag(tags, tag))
  }

  const handleAddCustomTag = () => {
    const newTags = addTag(tags, customTag)
    if (newTags.length > tags.length) {
      setTags(newTags)
      setCustomTag("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: insertError } = await supabase.from("templates").insert({
        title,
        description,
        category,
        difficulty,
        tags,
        preview_url: previewUrl || null,
        github_url: githubUrl || null,
        demo_url: demoUrl || null,
        submitted_by: userId,
      })

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(() => {
        router.push("/templates")
      }, 2000)
    } catch (err) {
      console.error("[v0] Error submitting template:", err)
      setError(err instanceof Error ? err.message : "Failed to submit template")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Template Submitted!</h2>
        <p className="text-muted-foreground mb-4">Your template has been successfully submitted for evaluation.</p>
        <p className="text-sm text-muted-foreground">Redirecting to gallery...</p>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-500">Error</p>
              <p className="text-sm text-red-500/80">{error}</p>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Template Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="e.g., E-commerce Starter Kit"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground">{title.length}/100 characters</p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your template, its features, and use cases..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={500}
            className="min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground">{description.length}/500 characters</p>
        </div>

        {/* Category and Difficulty */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
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
            <Label htmlFor="difficulty">
              Difficulty Level <span className="text-red-500">*</span>
            </Label>
            <Select value={difficulty} onValueChange={setDifficulty} required>
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
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

        {/* Tags */}
        <div className="space-y-3">
          <Label>
            Tags <span className="text-muted-foreground text-xs">(Select up to 10)</span>
          </Label>

          {/* Selected tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Common tags */}
          <div className="flex flex-wrap gap-2">
            {COMMON_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                disabled={tags.includes(tag) || tags.length >= 10}
                className="px-3 py-1 text-sm border rounded-full hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {tags.includes(tag) ? (
                  <Check className="w-3 h-3 inline mr-1" />
                ) : (
                  <Plus className="w-3 h-3 inline mr-1" />
                )}
                {tag}
              </button>
            ))}
          </div>

          {/* Custom tag input */}
          <div className="flex gap-2">
            <Input
              placeholder="Add custom tag..."
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddCustomTag()
                }
              }}
              disabled={tags.length >= 10}
            />
            <Button
              type="button"
              onClick={handleAddCustomTag}
              disabled={!customTag.trim() || tags.length >= 10}
              variant="outline"
            >
              Add
            </Button>
          </div>
        </div>

        {/* URLs */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="preview">Preview Image URL</Label>
            <Input
              id="preview"
              type="url"
              placeholder="https://example.com/preview.png"
              value={previewUrl}
              onChange={(e) => setPreviewUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Optional: Link to a preview image of your template</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="github">GitHub Repository URL</Label>
            <Input
              id="github"
              type="url"
              placeholder="https://github.com/username/repo"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo">Live Demo URL</Label>
            <Input
              id="demo"
              type="url"
              placeholder="https://demo.vercel.app"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !title || !description || !category || !difficulty || tags.length === 0}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Template"
            )}
          </Button>
        </div>
      </Card>
    </form>
  )
}
