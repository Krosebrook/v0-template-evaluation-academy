"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Download, FileJson, Database } from "lucide-react"
import { exportTemplates, createBackup } from "@/app/actions/import-export"

export default function ExportPage() {
  const [exportType, setExportType] = useState<"all" | "backup">("all")
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)

    try {
      const response = exportType === "backup" ? await createBackup() : await exportTemplates()

      if (response.success && response.data) {
        const blob = new Blob([response.data], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `templates-${exportType}-${Date.now()}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Export Templates</h1>
        <p className="text-muted-foreground">Download your templates for backup or migration</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
            <CardDescription>Choose what you want to export</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={exportType} onValueChange={(v: any) => setExportType(v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="flex items-center gap-2 cursor-pointer">
                  <FileJson className="h-4 w-4" />
                  <div>
                    <p className="font-medium">All Templates</p>
                    <p className="text-sm text-muted-foreground">Export all your templates as JSON</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="backup" id="backup" />
                <Label htmlFor="backup" className="flex items-center gap-2 cursor-pointer">
                  <Database className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Full Backup</p>
                    <p className="text-sm text-muted-foreground">Complete backup with metadata and timestamps</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <Button onClick={handleExport} disabled={exporting} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {exporting ? "Exporting..." : "Export Templates"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Automatic Backups</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Enable automatic daily backups to ensure your templates are always safe.
            </p>
            <Button variant="outline">Configure Automatic Backups</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
