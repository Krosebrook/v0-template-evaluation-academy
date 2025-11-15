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

/**
 * Parse a CSV line respecting RFC 4180 - handles quoted fields with commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i++
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      // Field separator
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

export async function parseCSV(file: File): Promise<TemplateImport[]> {
  const text = await file.text()
  const lines = text.split("\n").filter((line) => line.trim())

  if (lines.length < 2) {
    throw new Error("CSV file must have at least a header row and one data row")
  }

  const headers = parseCSVLine(lines[0]).map((h) => h.replace(/^"|"$/g, ""))
  const templates: TemplateImport[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]).map((v) => v.replace(/^"|"$/g, ""))
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

/**
 * Escape a CSV field value according to RFC 4180
 */
function escapeCSVField(value: string | undefined | null): string {
  if (!value) return '""'
  const stringValue = String(value)
  // Escape quotes by doubling them and wrap in quotes if contains comma, quote, or newline
  if (stringValue.includes('"') || stringValue.includes(",") || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return `"${stringValue}"`
}

export function generateCSV(templates: Template[]): string {
  if (templates.length === 0) return ""

  const headers = ["title", "description", "category", "tags", "created_at", "updated_at"]
  const rows = templates.map((t) => [
    escapeCSVField(t.title),
    escapeCSVField(t.description),
    escapeCSVField(t.category),
    escapeCSVField((t.tags || []).join("|")),
    escapeCSVField(t.created_at),
    escapeCSVField(t.updated_at),
  ])

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
}

export function generateJSON(templates: Template[]): string {
  return JSON.stringify(templates, null, 2)
}
