"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GitCompare, ExternalLink, Github, Star, X } from "lucide-react"
import Link from "next/link"

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
  created_at: string
  profiles: {
    display_name: string
  }
}

interface TemplateComparisonProps {
  selectedTemplates: Template[]
  allTemplates: { id: string; title: string; category: string }[]
  evaluationsMap: Record<string, any[]>
}

export function TemplateComparison({ selectedTemplates, allTemplates, evaluationsMap }: TemplateComparisonProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedTemplates.map((t) => t.id))
  const router = useRouter()

  const handleAddTemplate = (templateId: string) => {
    if (selectedIds.length >= 4) {
      alert("You can compare up to 4 templates at once")
      return
    }
    const newIds = [...selectedIds, templateId]
    setSelectedIds(newIds)
    router.push(`/templates/compare?ids=${newIds.join(",")}`)
  }

  const handleRemoveTemplate = (templateId: string) => {
    const newIds = selectedIds.filter((id) => id !== templateId)
    setSelectedIds(newIds)
    router.push(`/templates/compare?ids=${newIds.join(",")}`)
  }

  const calculateAverageScore = (evaluations: any[]) => {
    if (evaluations.length === 0) return null

    const sum = evaluations.reduce((acc, e) => {
      return acc + (e.code_quality + e.documentation + e.design + e.functionality + e.performance + e.innovation) / 6
    }, 0)

    return sum / evaluations.length
  }

  const calculateCriteriaAverage = (evaluations: any[], criterion: string) => {
    if (evaluations.length === 0) return 0
    const sum = evaluations.reduce((acc, e) => acc + (e[criterion] || 0), 0)
    return sum / evaluations.length
  }

  const availableTemplates = allTemplates.filter((t) => !selectedIds.includes(t.id))

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Select Templates to Compare
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Select onValueChange={handleAddTemplate}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Add a template to compare..." />
              </SelectTrigger>
              <SelectContent>
                {availableTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.title} ({template.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedIds([])
                router.push("/templates/compare")
              }}
            >
              Clear All
            </Button>
          </div>
          {selectedIds.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Comparing {selectedIds.length} template{selectedIds.length > 1 ? "s" : ""} (max 4)
            </p>
          )}
        </CardContent>
      </Card>

      {selectedTemplates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <GitCompare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select templates from the dropdown above to start comparing</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Basic Info Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {selectedTemplates.map((template) => {
              const evaluations = evaluationsMap[template.id] || []
              const avgScore = calculateAverageScore(evaluations)

              return (
                <Card key={template.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => handleRemoveTemplate(template.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardHeader>
                    <CardTitle className="text-lg pr-8">{template.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {template.preview_image && (
                      <img
                        src={template.preview_image || "/placeholder.svg"}
                        alt={template.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Author</span>
                        <span className="font-medium">{template.profiles?.display_name || "Anonymous"}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Category</span>
                        <Badge variant="secondary">{template.category}</Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Difficulty</span>
                        <Badge variant="outline">{template.difficulty}</Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Evaluations</span>
                        <span className="font-medium">{evaluations.length}</span>
                      </div>

                      {avgScore !== null && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Avg Score</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium">{avgScore.toFixed(1)}/10</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {template.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags?.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {template.github_url && (
                        <a href={template.github_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <Github className="h-4 w-4 mr-1" />
                            GitHub
                          </Button>
                        </a>
                      )}
                      {template.demo_url && (
                        <a href={template.demo_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Demo
                          </Button>
                        </a>
                      )}
                    </div>

                    <Link href={`/templates/results/${template.id}`}>
                      <Button variant="default" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Score Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Scores Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {["code_quality", "documentation", "design", "functionality", "performance", "innovation"].map(
                  (criterion) => (
                    <div key={criterion} className="space-y-3">
                      <h4 className="font-medium capitalize">{criterion.replace("_", " ")}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {selectedTemplates.map((template) => {
                          const evaluations = evaluationsMap[template.id] || []
                          const avgScore = calculateCriteriaAverage(evaluations, criterion)

                          return (
                            <div key={template.id} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="truncate flex-1 mr-2">{template.title}</span>
                                <span className="font-medium">
                                  {evaluations.length > 0 ? avgScore.toFixed(1) : "N/A"}/10
                                </span>
                              </div>
                              <Progress value={evaluations.length > 0 ? (avgScore / 10) * 100 : 0} />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Feature Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Feature</th>
                      {selectedTemplates.map((template) => (
                        <th key={template.id} className="text-left py-3 px-4 font-medium">
                          {template.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-sm text-muted-foreground">GitHub Repository</td>
                      {selectedTemplates.map((template) => (
                        <td key={template.id} className="py-3 px-4">
                          {template.github_url ? "✓" : "✗"}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-sm text-muted-foreground">Live Demo</td>
                      {selectedTemplates.map((template) => (
                        <td key={template.id} className="py-3 px-4">
                          {template.demo_url ? "✓" : "✗"}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-sm text-muted-foreground">Has Evaluations</td>
                      {selectedTemplates.map((template) => (
                        <td key={template.id} className="py-3 px-4">
                          {(evaluationsMap[template.id] || []).length > 0 ? "✓" : "✗"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm text-muted-foreground">Number of Tags</td>
                      {selectedTemplates.map((template) => (
                        <td key={template.id} className="py-3 px-4">
                          {template.tags?.length || 0}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
