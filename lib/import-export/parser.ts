import { z } from "zod"
import type { Template } from "@/types/database"

const TemplateImportSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  content: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type TemplateImport = z.infer<typeof TemplateImportSchema>

export async function parseCSV(file: File): Promise<TemplateImport[]> {
  const text = await file.text()
  const lines = text.split("\n").filter((line) => line.trim())

  if (lines.length < 2) {
    throw new Error("CSV file must have at least a header row and one data row")
  }

  const headers = lines[0].split(",").map((h) => h.trim())
  const templates: TemplateImport[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim())
    const template: Record<string, unknown> = {}

    headers.forEach((header, index) => {
      if (header === "tags") {
        template[header] = values[index] ? values[index].split("|") : []
      } else {
        template[header] = values[index] || ""
      }
    })

    try {
      templates.push(TemplateImportSchema.parse(template))
    } catch (error) {
      throw new Error(`Invalid template at row ${i + 1}: ${error}`)
    }
  }

  return templates
}

export async function parseJSON(file: File): Promise<TemplateImport[]> {
  const text = await file.text()
  const data = JSON.parse(text)

  const templates = Array.isArray(data) ? data : [data]

  return templates.map((template, index) => {
    try {
      return TemplateImportSchema.parse(template)
    } catch (error) {
      throw new Error(`Invalid template at index ${index}: ${error}`)
    }
  })
}

export function generateCSV(templates: Template[]): string {
  if (templates.length === 0) return ""

  const headers = ["title", "description", "category", "tags", "created_at", "updated_at"]
  const rows = templates.map((t) => [
    t.title,
    t.description,
    t.category,
    (t.tags || []).join("|"),
    t.created_at,
    t.updated_at,
  ])

  return [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")
}

export function generateJSON(templates: Template[]): string {
  return JSON.stringify(templates, null, 2)
}
