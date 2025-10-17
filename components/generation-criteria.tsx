"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

const criteria = [
  {
    id: "code-quality",
    label: "Code Quality",
    description: "Clean, maintainable, and well-structured code",
  },
  {
    id: "documentation",
    label: "Documentation",
    description: "Clear setup instructions and code comments",
  },
  {
    id: "performance",
    label: "Performance",
    description: "Fast load times and optimized assets",
  },
  {
    id: "accessibility",
    label: "Accessibility",
    description: "WCAG compliance and keyboard navigation",
  },
  {
    id: "design",
    label: "Design Quality",
    description: "Visual appeal and user experience",
  },
  {
    id: "scalability",
    label: "Scalability",
    description: "Ability to grow and add features",
  },
]

export function GenerationCriteria() {
  const [scores, setScores] = useState<Record<string, number>>({})

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generation Criteria</CardTitle>
          <p className="text-sm text-muted-foreground">Rate each criterion from 1-10 based on your assessment</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {criteria.map((criterion) => (
            <div key={criterion.id} className="space-y-3">
              <div>
                <Label className="text-base font-medium">{criterion.label}</Label>
                <p className="text-sm text-muted-foreground">{criterion.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  value={[scores[criterion.id] || 5]}
                  onValueChange={(value) => setScores({ ...scores, [criterion.id]: value[0] })}
                  max={10}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className="w-12 text-center font-mono text-lg font-semibold">{scores[criterion.id] || 5}/10</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Share your thoughts, suggestions, or observations about this template..."
            className="min-h-32 resize-none"
          />
        </CardContent>
      </Card>

      <Card className="bg-secondary">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Overall Score</p>
              <p className="text-sm text-muted-foreground">Average of all criteria</p>
            </div>
            <div className="text-4xl font-bold">
              {Object.keys(scores).length > 0
                ? (Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length).toFixed(1)
                : "5.0"}
              <span className="text-xl text-muted-foreground">/10</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
