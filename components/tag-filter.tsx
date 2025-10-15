"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface Tag {
  id: string
  name: string
  slug: string
  category: string
  color: string
}

interface TagFilterProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  category?: string
}

export function TagFilter({ selectedTags, onChange, category }: TagFilterProps) {
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    loadTags()
  }, [category])

  const loadTags = async () => {
    const supabase = createBrowserClient()
    let query = supabase.from("tags").select("*").order("name")

    if (category) {
      query = query.eq("category", category)
    }

    const { data } = await query

    if (data) {
      setTags(data)
    }
  }

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((id) => id !== tagId))
    } else {
      onChange([...selectedTags, tagId])
    }
  }

  if (tags.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.id)
          return (
            <Badge
              key={tag.id}
              variant={isSelected ? "default" : "outline"}
              className={cn("cursor-pointer", isSelected && "bg-primary")}
              style={isSelected ? { backgroundColor: tag.color } : {}}
              onClick={() => toggleTag(tag.id)}
            >
              {tag.name}
            </Badge>
          )
        })}
      </div>
      {selectedTags.length > 0 && (
        <Button variant="ghost" size="sm" onClick={() => onChange([])}>
          Clear all
        </Button>
      )}
    </div>
  )
}
