"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Zap, Download, Sparkles, FileText, Package } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ClaudeSkillGeneratorPage() {
  const [generating, setGenerating] = useState(false)
  const [skillConfig, setSkillConfig] = useState({
    name: "",
    description: "",
    instructions: "",
    examples: [""],
    tools: [],
  })

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setGenerating(false)
  }

  const handleDownloadZip = () => {
    // In a real implementation, this would create a proper .zip file
    alert("Skill package would be downloaded as a .zip file")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-mesh fixed inset-0 -z-10" />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Zap className="h-10 w-10" />
            Claude Skill Generator
          </h1>
          <p className="text-muted-foreground">
            Create fully populated skill packages for Claude with custom instructions, examples, and tools.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 glass">
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="skill-name">Skill Name</Label>
                    <Input
                      id="skill-name"
                      placeholder="e.g., Advanced Code Analysis"
                      value={skillConfig.name}
                      onChange={(e) => setSkillConfig({ ...skillConfig, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skill-description">Description</Label>
                    <Textarea
                      id="skill-description"
                      placeholder="Describe what your skill does..."
                      rows={4}
                      value={skillConfig.description}
                      onChange={(e) => setSkillConfig({ ...skillConfig, description: e.target.value })}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="instructions" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="skill-instructions">Skill Instructions</Label>
                      <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        {generating ? "Generating..." : "AI Generate"}
                      </Button>
                    </div>
                    <Textarea
                      id="skill-instructions"
                      placeholder="Enter detailed instructions for your Claude skill..."
                      rows={15}
                      value={skillConfig.instructions}
                      onChange={(e) => setSkillConfig({ ...skillConfig, instructions: e.target.value })}
                      className="font-mono text-sm"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="examples" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Usage Examples</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSkillConfig({ ...skillConfig, examples: [...skillConfig.examples, ""] })}
                      >
                        Add Example
                      </Button>
                    </div>
                    {skillConfig.examples.map((example, index) => (
                      <Textarea
                        key={index}
                        placeholder={`Example ${index + 1}`}
                        rows={4}
                        value={example}
                        onChange={(e) => {
                          const newExamples = [...skillConfig.examples]
                          newExamples[index] = e.target.value
                          setSkillConfig({ ...skillConfig, examples: newExamples })
                        }}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 glass">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Export Options
              </h3>
              <div className="space-y-3">
                <Button className="w-full" onClick={handleGenerate} disabled={generating}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {generating ? "Generating..." : "Generate Skill"}
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={handleDownloadZip}>
                  <Download className="h-4 w-4 mr-2" />
                  Download .zip Package
                </Button>
              </div>
            </Card>

            <Card className="p-6 glass">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Skill Templates
              </h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Code Reviewer
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Technical Writer
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Data Processor
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  API Designer
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
