"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createBrowserClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface Tag {
  id: string
  name: string
  slug: string
  category: string
  color: string
}

interface TagSelectorProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  maxTags?: number
}

export function TagSelector({ selectedTags, onChange, maxTags = 10 }: TagSelectorProps) {
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [filteredTags, setFilteredTags] = useState<Tag[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const supabase = useMemo(() => createBrowserClient(), [])

  const loadTags = useCallback(async () => {
    const { data } = await supabase.from("tags").select("*").order("name")

    if (data) {
      setAllTags(data)
      setFilteredTags(data)
    }
  }, [supabase])

  const filterTags = useCallback(() => {
    let filtered = allTags

    if (searchQuery) {
      filtered = filtered.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((tag) => tag.category === selectedCategory)
    }

    setFilteredTags(filtered)
  }, [allTags, searchQuery, selectedCategory])

  useEffect(() => {
    loadTags()
  }, [loadTags])

  useEffect(() => {
    filterTags()
  }, [filterTags])

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((id) => id !== tagId))
    } else if (selectedTags.length < maxTags) {
      onChange([...selectedTags, tagId])
    }
  }

  const selectedTagObjects = allTags.filter((tag) => selectedTags.includes(tag.id))

  const categories = [
    { value: "all", label: "All Tags" },
    { value: "technology", label: "Technology" },
    { value: "feature", label: "Features" },
    { value: "use-case", label: "Use Cases" },
    { value: "framework", label: "Frameworks" },
  ]

  return (
    <div className="space-y-2">
      <Label>
        Tags ({selectedTags.length}/{maxTags})
      </Label>

      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
        {selectedTagObjects.map((tag) => (
          <Badge key={tag.id} style={{ backgroundColor: tag.color }} className="gap-1">
            {tag.name}
            <X className="h-3 w-3 cursor-pointer" onClick={() => toggleTag(tag.id)} />
          </Badge>
        ))}

        {selectedTags.length < maxTags && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-6 bg-transparent">
                <Plus className="h-3 w-3 mr-1" />
                Add Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Select Tags</DialogTitle>
                <DialogDescription>Choose up to {maxTags} tags to categorize your template</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Search */}
                <Input
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Category Filter */}
                <div className="flex gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.value}
                      variant={selectedCategory === cat.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.value)}
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>

                {/* Tags Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
                  {filteredTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.id)
                    return (
                      <Button
                        key={tag.id}
                        variant="outline"
                        size="sm"
                        onClick={() => toggleTag(tag.id)}
                        className={cn("justify-start", isSelected && "border-primary bg-primary/10")}
                        disabled={!isSelected && selectedTags.length >= maxTags}
                      >
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tag.color }} />
                        {tag.name}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
