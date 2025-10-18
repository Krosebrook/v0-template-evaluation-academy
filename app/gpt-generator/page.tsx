"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Download, Sparkles, FileText, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GPTGeneratorPage() {
  const [generating, setGenerating] = useState(false)
  const [gptConfig, setGptConfig] = useState({
    name: "",
    description: "",
    instructions: "",
    conversationStarters: ["", "", "", ""],
    capabilities: {
      webBrowsing: false,
      dalleImageGeneration: false,
      codeInterpreter: false,
    },
  })

  const handleGenerate = async () => {
    setGenerating(true)
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setGenerating(false)
  }

  const handleDownload = () => {
    const config = JSON.stringify(gptConfig, null, 2)
    const blob = new Blob([config], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${gptConfig.name || "custom-gpt"}-config.json`
    a.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-mesh fixed inset-0 -z-10" />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Bot className="h-10 w-10" />
            Custom GPT Generator
          </h1>
          <p className="text-muted-foreground">
            Generate fully configured Custom GPT templates with AI-powered instructions and configurations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 glass">
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">GPT Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Code Review Assistant"
                      value={gptConfig.name}
                      onChange={(e) => setGptConfig({ ...gptConfig, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what your GPT does..."
                      rows={3}
                      value={gptConfig.description}
                      onChange={(e) => setGptConfig({ ...gptConfig, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Conversation Starters</Label>
                    {gptConfig.conversationStarters.map((starter, index) => (
                      <Input
                        key={index}
                        placeholder={`Starter ${index + 1}`}
                        value={starter}
                        onChange={(e) => {
                          const newStarters = [...gptConfig.conversationStarters]
                          newStarters[index] = e.target.value
                          setGptConfig({ ...gptConfig, conversationStarters: newStarters })
                        }}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="instructions" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="instructions">Custom Instructions</Label>
                      <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        {generating ? "Generating..." : "AI Generate"}
                      </Button>
                    </div>
                    <Textarea
                      id="instructions"
                      placeholder="Enter detailed instructions for your GPT..."
                      rows={15}
                      value={gptConfig.instructions}
                      onChange={(e) => setGptConfig({ ...gptConfig, instructions: e.target.value })}
                      className="font-mono text-sm"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <Label>Capabilities</Label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gptConfig.capabilities.webBrowsing}
                          onChange={(e) =>
                            setGptConfig({
                              ...gptConfig,
                              capabilities: { ...gptConfig.capabilities, webBrowsing: e.target.checked },
                            })
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-sm">Web Browsing</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gptConfig.capabilities.dalleImageGeneration}
                          onChange={(e) =>
                            setGptConfig({
                              ...gptConfig,
                              capabilities: { ...gptConfig.capabilities, dalleImageGeneration: e.target.checked },
                            })
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-sm">DALL·E Image Generation</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gptConfig.capabilities.codeInterpreter}
                          onChange={(e) =>
                            setGptConfig({
                              ...gptConfig,
                              capabilities: { ...gptConfig.capabilities, codeInterpreter: e.target.checked },
                            })
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-sm">Code Interpreter</span>
                      </label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 glass">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button className="w-full" onClick={handleGenerate} disabled={generating}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {generating ? "Generating..." : "Generate Instructions"}
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Config
                </Button>
              </div>
            </Card>

            <Card className="p-6 glass">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Templates
              </h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Code Review Assistant
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Content Writer
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Data Analyst
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Research Assistant
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
