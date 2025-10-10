"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Download, Package, Check, X, AlertCircle } from "lucide-react"

interface ExportData {
  prompts?: any[]
  configs?: any[]
  history?: any[]
  favorites?: any[]
  tutorials?: any[]
}

interface ImportExportManagerProps {
  onClose: () => void
  onImport: (data: ExportData) => void
}

export function ImportExportManager({ onClose, onImport }: ImportExportManagerProps) {
  const [activeTab, setActiveTab] = useState<"export" | "import">("export")
  const [selectedItems, setSelectedItems] = useState({
    prompts: true,
    configs: true,
    history: true,
    favorites: true,
    tutorials: false,
  })
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importPreview, setImportPreview] = useState<ExportData | null>(null)
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")

  const exportData = () => {
    const data: ExportData = {}

    if (selectedItems.prompts) {
      const history = localStorage.getItem("prompt_history")
      data.prompts = history ? JSON.parse(history) : []
    }

    if (selectedItems.configs) {
      const configs = localStorage.getItem("saved_configs")
      data.configs = configs ? JSON.parse(configs) : []
    }

    if (selectedItems.history) {
      const comparisonHistory = localStorage.getItem("comparison_history")
      data.history = comparisonHistory ? JSON.parse(comparisonHistory) : []
    }

    if (selectedItems.favorites) {
      const favorites = localStorage.getItem("favorite_prompts")
      data.favorites = favorites ? JSON.parse(favorites) : []
    }

    if (selectedItems.tutorials) {
      const tutorialProgress = localStorage.getItem("tutorial_progress")
      data.tutorials = tutorialProgress ? JSON.parse(tutorialProgress) : []
    }

    const exportPackage = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      data,
    }

    const blob = new Blob([JSON.stringify(exportPackage, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `prompt-academy-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsTemplate = () => {
    const configs = localStorage.getItem("saved_configs")
    const parsedConfigs = configs ? JSON.parse(configs) : []

    const template = {
      name: "Custom Template Pack",
      version: "1.0.0",
      templates: parsedConfigs.map((config: any) => ({
        name: config.name,
        description: config.description || "Custom template",
        config: {
          personas: config.personas,
          layers: config.layers,
          promptType: config.promptType,
          temperature: config.temperature,
          complexity: config.complexity,
        },
      })),
    }

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `template-pack-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        setImportPreview(json.data || json)
        setImportStatus("idle")
      } catch (error) {
        setImportStatus("error")
        setImportPreview(null)
      }
    }
    reader.readAsText(file)
  }

  const executeImport = () => {
    if (!importPreview) return

    try {
      if (importPreview.prompts) {
        const existing = localStorage.getItem("prompt_history")
        const existingData = existing ? JSON.parse(existing) : []
        localStorage.setItem("prompt_history", JSON.stringify([...importPreview.prompts, ...existingData]))
      }

      if (importPreview.configs) {
        const existing = localStorage.getItem("saved_configs")
        const existingData = existing ? JSON.parse(existing) : []
        localStorage.setItem("saved_configs", JSON.stringify([...importPreview.configs, ...existingData]))
      }

      if (importPreview.history) {
        const existing = localStorage.getItem("comparison_history")
        const existingData = existing ? JSON.parse(existing) : []
        localStorage.setItem("comparison_history", JSON.stringify([...importPreview.history, ...existingData]))
      }

      if (importPreview.favorites) {
        const existing = localStorage.getItem("favorite_prompts")
        const existingData = existing ? JSON.parse(existing) : []
        localStorage.setItem("favorite_prompts", JSON.stringify([...importPreview.favorites, ...existingData]))
      }

      setImportStatus("success")
      onImport(importPreview)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      setImportStatus("error")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Import / Export Manager</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="export">
                <Download className="w-4 h-4 mr-2" />
                Export
              </TabsTrigger>
              <TabsTrigger value="import">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </TabsTrigger>
            </TabsList>

            <TabsContent value="export" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Select Data to Export</h3>
                <div className="space-y-3">
                  {Object.entries(selectedItems).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => setSelectedItems({ ...selectedItems, [key]: checked as boolean })}
                      />
                      <label htmlFor={key} className="text-sm font-medium capitalize cursor-pointer">
                        {key}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={exportData} className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Export as JSON
                </Button>
                <Button onClick={exportAsTemplate} variant="outline" className="w-full gap-2 bg-transparent">
                  <Package className="w-4 h-4" />
                  Export as Template Pack
                </Button>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-sm">Export Formats</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• JSON: Complete data backup with all settings</li>
                  <li>• Template Pack: Shareable configuration templates</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="import" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Import Data</h3>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <input type="file" accept=".json" onChange={handleFileSelect} className="hidden" id="import-file" />
                  <label htmlFor="import-file" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">JSON files only</p>
                  </label>
                </div>

                {importFile && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{importFile.name}</span>
                      <Badge variant={importStatus === "error" ? "destructive" : "secondary"}>
                        {importStatus === "error" ? "Invalid" : "Ready"}
                      </Badge>
                    </div>
                    {importPreview && (
                      <div className="text-sm text-muted-foreground space-y-1">
                        {importPreview.prompts && <div>• {importPreview.prompts.length} prompts</div>}
                        {importPreview.configs && <div>• {importPreview.configs.length} configurations</div>}
                        {importPreview.history && <div>• {importPreview.history.length} history items</div>}
                        {importPreview.favorites && <div>• {importPreview.favorites.length} favorites</div>}
                      </div>
                    )}
                  </div>
                )}

                {importStatus === "success" && (
                  <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-500">Import successful!</span>
                  </div>
                )}

                {importStatus === "error" && (
                  <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-red-500">Invalid file format</span>
                  </div>
                )}

                <Button
                  onClick={executeImport}
                  disabled={!importPreview || importStatus === "error"}
                  className="w-full gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Import Data
                </Button>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Import Notes
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Imported data will be merged with existing data</li>
                  <li>• Duplicates will be preserved</li>
                  <li>• Create a backup before importing</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}
