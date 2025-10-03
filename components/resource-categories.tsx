"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, Video, FileText, Code, Lightbulb, Users } from "lucide-react"

const categories = [
  { id: "all", label: "All Resources", icon: BookOpen },
  { id: "guides", label: "Guides", icon: FileText },
  { id: "videos", label: "Video Tutorials", icon: Video },
  { id: "code", label: "Code Examples", icon: Code },
  { id: "tips", label: "Tips & Tricks", icon: Lightbulb },
  { id: "community", label: "Community", icon: Users },
]

export function ResourceCategories() {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 px-2 font-semibold">Categories</h3>
      {categories.map((category) => (
        <Button key={category.id} variant="ghost" className="w-full justify-start gap-2">
          <category.icon className="h-4 w-4" />
          {category.label}
        </Button>
      ))}
    </div>
  )
}
