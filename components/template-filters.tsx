"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

const filters = {
  difficulty: ["Beginner", "Intermediate", "Advanced"],
  category: ["E-commerce", "SaaS", "Portfolio", "Dashboard", "AI", "Blog"],
  framework: ["Next.js", "React", "Vue", "Svelte"],
}

export function TemplateFilters() {
  return (
    <div className="space-y-6 rounded-lg border border-border bg-card p-6">
      <div>
        <h3 className="mb-4 font-semibold">Filter Templates</h3>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-medium">Difficulty</Label>
        <div className="space-y-2">
          {filters.difficulty.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox id={`difficulty-${item}`} />
              <label
                htmlFor={`difficulty-${item}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="mb-3 block text-sm font-medium">Category</Label>
        <div className="space-y-2">
          {filters.category.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox id={`category-${item}`} />
              <label
                htmlFor={`category-${item}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="mb-3 block text-sm font-medium">Framework</Label>
        <div className="space-y-2">
          {filters.framework.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox id={`framework-${item}`} />
              <label
                htmlFor={`framework-${item}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
