"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Bot,
  Download,
  Sparkles,
  FileText,
  Zap,
  Upload,
  Plus,
  Trash2,
  Globe,
  ImageIcon,
  Code,
  Palette,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface Action {
  id: string
  name: string
  description: string
  authType: "none" | "api_key" | "oauth"
  apiKeyConfig?: {
    type: "bearer" | "basic" | "custom"
    customHeaderName?: string
  }
  oauthConfig?: {
    clientId: string
    clientSecret: string
    authorizationUrl: string
    tokenUrl: string
    scope: string
  }
  schema: string
}

export default function GPTGeneratorPage() {
  const [generating, setGenerating] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [gptConfig, setGptConfig] = useState({
    name: "",
    description: "",
    instructions: "",
    conversationStarters: ["", "", "", ""],
    capabilities: {
      webBrowsing: false,
      dalleImageGeneration: false,
      codeInterpreter: false,
      canvas: false,
    },
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const addAction = () => {
    const newAction: Action = {
      id: Date.now().toString(),
      name: "",
      description: "",
      authType: "none",
      schema: `{
  "openapi": "3.1.0",
  "info": {
    "title": "API",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://api.example.com"
    }
  ],
  "paths": {
    "/endpoint": {
      "get": {
        "operationId": "getEndpoint",
        "summary": "Get data",
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    }
  }
}`,
    }
    setActions([...actions, newAction])
  }

  const removeAction = (id: string) => {
    setActions(actions.filter((a) => a.id !== id))
  }

  const updateAction = (id: string, updates: Partial<Action>) => {
    setActions(actions.map((a) => (a.id === id ? { ...a, ...updates } : a)))
  }

  const generateComprehensiveSchema = async (actionName: string, actionDescription: string) => {
    setGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const comprehensiveSchema = {
      openapi: "3.1.0",
      info: {
        title: actionName || "Custom API",
        description: actionDescription || "API for custom GPT action",
        version: "1.0.0",
      },
      servers: [{ url: "https://api.example.com" }],
      paths: {
        "/query": {
          post: {
            operationId: "queryData",
            summary: "Query data based on user input",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      query: { type: "string", description: "User query" },
                      filters: { type: "object", description: "Optional filters" },
                      limit: { type: "integer", default: 10 },
                    },
                    required: ["query"],
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        results: { type: "array", items: { type: "object" } },
                        total: { type: "integer" },
                        metadata: { type: "object" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }

    setGenerating(false)
    return JSON.stringify(comprehensiveSchema, null, 2)
  }

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const generatedInstructions = `You are ${gptConfig.name || "a helpful assistant"}.

${gptConfig.description}

## Core Capabilities
${gptConfig.capabilities.webBrowsing ? "- Web browsing for real-time information\n" : ""}${gptConfig.capabilities.dalleImageGeneration ? "- Image generation with DALL·E\n" : ""}${gptConfig.capabilities.codeInterpreter ? "- Code execution and data analysis\n" : ""}${gptConfig.capabilities.canvas ? "- Canvas for visual content creation\n" : ""}

## Knowledge Base
${uploadedFiles.length > 0 ? `You have access to ${uploadedFiles.length} knowledge file(s):\n${uploadedFiles.map((f) => `- ${f.name}`).join("\n")}` : "No additional knowledge files uploaded."}

## Custom Actions
${actions.length > 0 ? `You can perform the following actions:\n${actions.map((a) => `- ${a.name}: ${a.description}`).join("\n")}` : "No custom actions configured."}

## Guidelines
- Always be helpful, accurate, and concise
- Use your capabilities when appropriate
- Cite sources when using web browsing
- Explain your reasoning when solving complex problems
- Ask clarifying questions when needed`

    setGptConfig({ ...gptConfig, instructions: generatedInstructions })
    setGenerating(false)
  }

  const handleDownload = () => {
    const fullConfig = {
      ...gptConfig,
      knowledgeFiles: uploadedFiles.map((f) => f.name),
      actions: actions.map((a) => ({
        name: a.name,
        description: a.description,
        authentication: {
          type: a.authType,
          ...(a.authType === "api_key" && a.apiKeyConfig),
          ...(a.authType === "oauth" && a.oauthConfig),
        },
        schema: JSON.parse(a.schema),
      })),
    }

    const blob = new Blob([JSON.stringify(fullConfig, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${gptConfig.name || "custom-gpt"}-config.json`
    a.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-mesh fixed inset-0 -z-10" />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Bot className="h-10 w-10" />
            Custom GPT Builder
          </h1>
          <p className="text-muted-foreground">
            Generate fully configured Custom GPT templates with knowledge files, actions, and AI-powered instructions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 glass">
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                  <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                  <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
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
                      rows={20}
                      value={gptConfig.instructions}
                      onChange={(e) => setGptConfig({ ...gptConfig, instructions: e.target.value })}
                      className="font-mono text-sm"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="capabilities" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <Label>Enable Capabilities</Label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Web Browsing</p>
                            <p className="text-sm text-muted-foreground">
                              Search and browse the web for real-time information
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={gptConfig.capabilities.webBrowsing}
                          onCheckedChange={(checked) =>
                            setGptConfig({
                              ...gptConfig,
                              capabilities: { ...gptConfig.capabilities, webBrowsing: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">DALL·E Image Generation</p>
                            <p className="text-sm text-muted-foreground">Generate images from text descriptions</p>
                          </div>
                        </div>
                        <Switch
                          checked={gptConfig.capabilities.dalleImageGeneration}
                          onCheckedChange={(checked) =>
                            setGptConfig({
                              ...gptConfig,
                              capabilities: { ...gptConfig.capabilities, dalleImageGeneration: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Code className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Code Interpreter & Data Analysis</p>
                            <p className="text-sm text-muted-foreground">Execute code and analyze data files</p>
                          </div>
                        </div>
                        <Switch
                          checked={gptConfig.capabilities.codeInterpreter}
                          onCheckedChange={(checked) =>
                            setGptConfig({
                              ...gptConfig,
                              capabilities: { ...gptConfig.capabilities, codeInterpreter: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Palette className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Canvas</p>
                            <p className="text-sm text-muted-foreground">
                              Create and edit visual content collaboratively
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={gptConfig.capabilities.canvas}
                          onCheckedChange={(checked) =>
                            setGptConfig({
                              ...gptConfig,
                              capabilities: { ...gptConfig.capabilities, canvas: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="knowledge" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Knowledge Files</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("file-upload")?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                        accept=".txt,.pdf,.doc,.docx,.md,.json,.csv"
                      />
                    </div>

                    {uploadedFiles.length === 0 ? (
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">No files uploaded yet</p>
                        <p className="text-xs text-muted-foreground">
                          Upload documents, PDFs, or text files to give your GPT additional knowledge
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Custom Actions</Label>
                      <Button variant="outline" size="sm" onClick={addAction}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Action
                      </Button>
                    </div>

                    {actions.length === 0 ? (
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">No actions configured</p>
                        <p className="text-xs text-muted-foreground">
                          Add custom actions to connect your GPT to external APIs
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {actions.map((action) => (
                          <Card key={action.id} className="p-4 border-2">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold">Action Configuration</h4>
                                <Button variant="ghost" size="sm" onClick={() => removeAction(action.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Action Name</Label>
                                  <Input
                                    placeholder="e.g., Search Database"
                                    value={action.name}
                                    onChange={(e) => updateAction(action.id, { name: e.target.value })}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Authentication</Label>
                                  <Select
                                    value={action.authType}
                                    onValueChange={(value: "none" | "api_key" | "oauth") =>
                                      updateAction(action.id, { authType: value })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">None</SelectItem>
                                      <SelectItem value="api_key">API Key</SelectItem>
                                      <SelectItem value="oauth">OAuth</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                  placeholder="Describe what this action does..."
                                  rows={2}
                                  value={action.description}
                                  onChange={(e) => updateAction(action.id, { description: e.target.value })}
                                />
                              </div>

                              {action.authType === "api_key" && (
                                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                                  <Label>API Key Configuration</Label>
                                  <div className="space-y-2">
                                    <Label className="text-sm">Authentication Type</Label>
                                    <Select
                                      value={action.apiKeyConfig?.type || "bearer"}
                                      onValueChange={(value: "bearer" | "basic" | "custom") =>
                                        updateAction(action.id, {
                                          apiKeyConfig: { ...action.apiKeyConfig, type: value },
                                        })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="bearer">Bearer Token</SelectItem>
                                        <SelectItem value="basic">Basic Auth</SelectItem>
                                        <SelectItem value="custom">Custom Header</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  {action.apiKeyConfig?.type === "custom" && (
                                    <div className="space-y-2">
                                      <Label className="text-sm">Custom Header Name</Label>
                                      <Input
                                        placeholder="e.g., X-API-Key"
                                        value={action.apiKeyConfig?.customHeaderName || ""}
                                        onChange={(e) =>
                                          updateAction(action.id, {
                                            apiKeyConfig: {
                                              ...action.apiKeyConfig,
                                              customHeaderName: e.target.value,
                                            },
                                          })
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              )}

                              {action.authType === "oauth" && (
                                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                                  <Label>OAuth Configuration</Label>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm">Client ID</Label>
                                      <Input
                                        placeholder="Your OAuth client ID"
                                        value={action.oauthConfig?.clientId || ""}
                                        onChange={(e) =>
                                          updateAction(action.id, {
                                            oauthConfig: { ...action.oauthConfig!, clientId: e.target.value },
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm">Client Secret</Label>
                                      <Input
                                        type="password"
                                        placeholder="Your OAuth client secret"
                                        value={action.oauthConfig?.clientSecret || ""}
                                        onChange={(e) =>
                                          updateAction(action.id, {
                                            oauthConfig: { ...action.oauthConfig!, clientSecret: e.target.value },
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm">Authorization URL</Label>
                                      <Input
                                        placeholder="https://oauth.example.com/authorize"
                                        value={action.oauthConfig?.authorizationUrl || ""}
                                        onChange={(e) =>
                                          updateAction(action.id, {
                                            oauthConfig: { ...action.oauthConfig!, authorizationUrl: e.target.value },
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm">Token URL</Label>
                                      <Input
                                        placeholder="https://oauth.example.com/token"
                                        value={action.oauthConfig?.tokenUrl || ""}
                                        onChange={(e) =>
                                          updateAction(action.id, {
                                            oauthConfig: { ...action.oauthConfig!, tokenUrl: e.target.value },
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                      <Label className="text-sm">Scope</Label>
                                      <Input
                                        placeholder="read write"
                                        value={action.oauthConfig?.scope || ""}
                                        onChange={(e) =>
                                          updateAction(action.id, {
                                            oauthConfig: { ...action.oauthConfig!, scope: e.target.value },
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label>OpenAPI Schema</Label>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={async () => {
                                      const schema = await generateComprehensiveSchema(action.name, action.description)
                                      updateAction(action.id, { schema })
                                    }}
                                    disabled={generating}
                                  >
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    {generating ? "Generating..." : "AI Generate"}
                                  </Button>
                                </div>
                                <Textarea
                                  placeholder="OpenAPI 3.1.0 schema..."
                                  rows={12}
                                  value={action.schema}
                                  onChange={(e) => updateAction(action.id, { schema: e.target.value })}
                                  className="font-mono text-xs"
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
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
                Configuration Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capabilities:</span>
                  <span className="font-medium">{Object.values(gptConfig.capabilities).filter(Boolean).length}/4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Knowledge Files:</span>
                  <span className="font-medium">{uploadedFiles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Custom Actions:</span>
                  <span className="font-medium">{actions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instructions:</span>
                  <span className="font-medium">
                    {gptConfig.instructions ? `${gptConfig.instructions.length} chars` : "Not set"}
                  </span>
                </div>
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
