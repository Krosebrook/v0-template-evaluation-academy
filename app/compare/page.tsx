"use client"

import "client-only"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, X, Copy, Download, BarChart3, Sparkles } from "lucide-react"
import Link from "next/link"

interface ComparisonPrompt {
  id: string
  name: string
  content: string
  type: string
  personas: string[]
  layers: string[]
  score?: number
  metrics?: {
    clarity: number
    specificity: number
    completeness: number
    effectiveness: number
  }
}

export default function ComparePage() {
  const [prompts, setPrompts] = useState<ComparisonPrompt[]>([
    {
      id: "1",
      name: "Prompt A",
      content: "",
      type: "Golden Prompt",
      personas: ["Expert"],
      layers: ["Role", "Context", "Task"],
    },
    {
      id: "2",
      name: "Prompt B",
      content: "",
      type: "Meta Prompt",
      personas: ["Creative"],
      layers: ["Role", "Task", "Format"],
    },
  ])
  const [activeView, setActiveView] = useState<"side-by-side" | "diff" | "metrics">("side-by-side")
  const [comparisonHistory, setComparisonHistory] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("comparison_history")
    if (saved) {
      setComparisonHistory(JSON.parse(saved))
    }
  }, [])

  const addPrompt = () => {
    if (prompts.length >= 4) return
    const newPrompt: ComparisonPrompt = {
      id: Date.now().toString(),
      name: `Prompt ${String.fromCharCode(65 + prompts.length)}`,
      content: "",
      type: "Golden Prompt",
      personas: [],
      layers: [],
    }
    setPrompts([...prompts, newPrompt])
  }

  const removePrompt = (id: string) => {
    if (prompts.length <= 2) return
    setPrompts(prompts.filter((p) => p.id !== id))
  }

  const updatePrompt = (id: string, updates: Partial<ComparisonPrompt>) => {
    setPrompts(prompts.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const analyzePrompts = () => {
    const analyzed = prompts.map((prompt) => {
      const wordCount = prompt.content.split(/\s+/).length
      const hasRole =
        prompt.content.toLowerCase().includes("you are") || prompt.content.toLowerCase().includes("act as")
      const hasContext = prompt.content.length > 100
      const hasTask =
        prompt.content.toLowerCase().includes("create") || prompt.content.toLowerCase().includes("generate")
      const hasFormat =
        prompt.content.toLowerCase().includes("format") || prompt.content.toLowerCase().includes("output")

      const clarity = Math.min(100, (wordCount / 50) * 100)
      const specificity = (hasRole ? 25 : 0) + (hasContext ? 25 : 0) + (hasTask ? 25 : 0) + (hasFormat ? 25 : 0)
      const completeness = Math.min(100, (prompt.content.length / 500) * 100)
      const effectiveness = (clarity + specificity + completeness) / 3

      return {
        ...prompt,
        score: Math.round(effectiveness),
        metrics: {
          clarity: Math.round(clarity),
          specificity,
          completeness: Math.round(completeness),
          effectiveness: Math.round(effectiveness),
        },
      }
    })

    setPrompts(analyzed)

    const comparison = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      prompts: analyzed,
    }
    const updated = [comparison, ...comparisonHistory].slice(0, 10)
    setComparisonHistory(updated)
    localStorage.setItem("comparison_history", JSON.stringify(updated))
  }

  const getDiff = (text1: string, text2: string) => {
    const words1 = text1.split(/\s+/)
    const words2 = text2.split(/\s+/)
    const maxLen = Math.max(words1.length, words2.length)

    const diff = []
    for (let i = 0; i < maxLen; i++) {
      if (words1[i] !== words2[i]) {
        diff.push({
          index: i,
          word1: words1[i] || "",
          word2: words2[i] || "",
        })
      }
    }
    return diff
  }

  const exportComparison = () => {
    const data = {
      timestamp: new Date().toISOString(),
      prompts: prompts.map((p) => ({
        name: p.name,
        content: p.content,
        type: p.type,
        personas: p.personas,
        layers: p.layers,
        score: p.score,
        metrics: p.metrics,
      })),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `prompt-comparison-${Date.now()}.json`
    a.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-balance">Prompt Comparison</h1>
              <p className="text-muted-foreground mt-1">Compare and analyze multiple prompts side-by-side</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={analyzePrompts} variant="default">
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze All
            </Button>
            <Button onClick={exportComparison} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="mb-6">
          <TabsList>
            <TabsTrigger value="side-by-side">Side-by-Side</TabsTrigger>
            <TabsTrigger value="diff">Diff View</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="side-by-side" className="mt-6">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${prompts.length}, 1fr)` }}>
              {prompts.map((prompt, index) => (
                <Card key={prompt.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{prompt.name}</h3>
                      {prompt.score && (
                        <Badge variant={prompt.score >= 70 ? "default" : "secondary"}>{prompt.score}%</Badge>
                      )}
                    </div>
                    {prompts.length > 2 && (
                      <Button variant="ghost" size="sm" onClick={() => removePrompt(prompt.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Prompt Content</label>
                      <Textarea
                        value={prompt.content}
                        onChange={(e) => updatePrompt(prompt.id, { content: e.target.value })}
                        placeholder="Enter your prompt here..."
                        className="min-h-[200px] font-mono text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Type</label>
                      <select
                        value={prompt.type}
                        onChange={(e) => updatePrompt(prompt.id, { type: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border bg-background"
                      >
                        <option>Golden Prompt</option>
                        <option>Meta Prompt</option>
                        <option>Context Engineered</option>
                        <option>Chain-of-Thought</option>
                        <option>Few-Shot</option>
                        <option>Zero-Shot</option>
                      </select>
                    </div>

                    {prompt.metrics && (
                      <div className="space-y-2 pt-4 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Clarity</span>
                          <span className="font-medium">{prompt.metrics.clarity}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Specificity</span>
                          <span className="font-medium">{prompt.metrics.specificity}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Completeness</span>
                          <span className="font-medium">{prompt.metrics.completeness}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {prompts.length < 4 && (
                <Card className="p-6 flex items-center justify-center border-dashed">
                  <Button onClick={addPrompt} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Prompt
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="diff" className="mt-6">
            {prompts.length >= 2 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">
                  Comparing {prompts[0].name} vs {prompts[1].name}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-primary">{prompts[0].name}</h4>
                    <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
                      {prompts[0].content || "No content"}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-secondary">{prompts[1].name}</h4>
                    <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
                      {prompts[1].content || "No content"}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">Key Differences</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Length Difference</span>
                      <span className="font-medium">
                        {Math.abs(prompts[0].content.length - prompts[1].content.length)} characters
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Word Count Difference</span>
                      <span className="font-medium">
                        {Math.abs(prompts[0].content.split(/\s+/).length - prompts[1].content.split(/\s+/).length)}{" "}
                        words
                      </span>
                    </div>
                    {prompts[0].score && prompts[1].score && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Score Difference</span>
                        <span className="font-medium">{Math.abs(prompts[0].score - prompts[1].score)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="metrics" className="mt-6">
            <div className="grid gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance Metrics
                </h3>
                <div className="space-y-6">
                  {prompts.map((prompt) => (
                    <div key={prompt.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{prompt.name}</h4>
                        {prompt.score && (
                          <Badge variant={prompt.score >= 70 ? "default" : "secondary"} className="text-lg px-3 py-1">
                            {prompt.score}%
                          </Badge>
                        )}
                      </div>
                      {prompt.metrics && (
                        <div className="grid grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Clarity</div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${prompt.metrics.clarity}%` }}
                              />
                            </div>
                            <div className="text-sm font-medium">{prompt.metrics.clarity}%</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Specificity</div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-secondary transition-all"
                                style={{ width: `${prompt.metrics.specificity}%` }}
                              />
                            </div>
                            <div className="text-sm font-medium">{prompt.metrics.specificity}%</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Completeness</div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent transition-all"
                                style={{ width: `${prompt.metrics.completeness}%` }}
                              />
                            </div>
                            <div className="text-sm font-medium">{prompt.metrics.completeness}%</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Effectiveness</div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                                style={{ width: `${prompt.metrics.effectiveness}%` }}
                              />
                            </div>
                            <div className="text-sm font-medium">{prompt.metrics.effectiveness}%</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {comparisonHistory.length > 0 && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Comparison History</h3>
                  <div className="space-y-3">
                    {comparisonHistory.slice(0, 5).map((comparison) => (
                      <div key={comparison.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{comparison.prompts.length} prompts compared</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(comparison.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
