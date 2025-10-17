"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileJson, FileSpreadsheet, CheckCircle2, XCircle } from "lucide-react"
import { importTemplates } from "@/app/actions/import-export"

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setResult(null)

    const formData = new FormData()
    formData.append("file", file)

    const response = await importTemplates(formData)
    setResult(response)
    setImporting(false)
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Import Templates</h1>
        <p className="text-muted-foreground">Bulk import templates from CSV or JSON files</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>Select a CSV or JSON file containing your templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Template File</Label>
              <Input id="file" type="file" accept=".csv,.json" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>

            {file && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                {file.name.endsWith(".json") ? (
                  <FileJson className="h-5 w-5 text-blue-500" />
                ) : (
                  <FileSpreadsheet className="h-5 w-5 text-green-500" />
                )}
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-sm text-muted-foreground ml-auto">{(file.size / 1024).toFixed(2)} KB</span>
              </div>
            )}

            <Button onClick={handleImport} disabled={!file || importing} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {importing ? "Importing..." : "Import Templates"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertDescription>
              {result.success ? (
                <div>
                  <p className="font-medium">Import completed successfully!</p>
                  <p className="text-sm mt-1">
                    Imported: {result.imported} templates
                    {result.failed > 0 && ` | Failed: ${result.failed}`}
                  </p>
                </div>
              ) : (
                <p>{result.error}</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>File Format Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">CSV Format</h3>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                {`name,description,category,tags
"My Template","Template description","Web Development","react|nextjs|typescript"
"Another Template","Another description","Design","figma|ui"`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium mb-2">JSON Format</h3>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                {`[
  {
    "name": "My Template",
    "description": "Template description",
    "category": "Web Development",
    "tags": ["react", "nextjs", "typescript"]
  }
]`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
