export interface SuggestedTag {
  tag: string
  confidence: number
}

export function generateTags(template: { name: string; description: string; content?: string }): SuggestedTag[] {
  const text = `${template.name} ${template.description} ${template.content || ""}`.toLowerCase()

  const tagPatterns = [
    { pattern: /react|jsx|component/i, tag: "react", weight: 1.0 },
    { pattern: /next\.?js|nextjs/i, tag: "nextjs", weight: 1.0 },
    { pattern: /typescript|ts/i, tag: "typescript", weight: 1.0 },
    { pattern: /javascript|js/i, tag: "javascript", weight: 0.9 },
    { pattern: /tailwind|css/i, tag: "tailwindcss", weight: 1.0 },
    { pattern: /ui|interface|design/i, tag: "ui-design", weight: 0.8 },
    { pattern: /api|backend|server/i, tag: "backend", weight: 0.9 },
    { pattern: /database|sql|postgres/i, tag: "database", weight: 0.9 },
    { pattern: /auth|authentication|login/i, tag: "authentication", weight: 1.0 },
    { pattern: /dashboard|admin/i, tag: "dashboard", weight: 0.9 },
    { pattern: /form|input|validation/i, tag: "forms", weight: 0.8 },
    { pattern: /chart|graph|visualization/i, tag: "data-visualization", weight: 0.9 },
    { pattern: /mobile|responsive/i, tag: "mobile", weight: 0.8 },
    { pattern: /animation|motion/i, tag: "animation", weight: 0.9 },
    { pattern: /ai|machine learning|ml/i, tag: "ai", weight: 1.0 },
  ]

  const suggestions: SuggestedTag[] = []

  for (const { pattern, tag, weight } of tagPatterns) {
    const matches = text.match(pattern)
    if (matches) {
      const occurrences = matches.length
      const confidence = Math.min(weight * (0.6 + occurrences * 0.1), 1.0)
      suggestions.push({ tag, confidence })
    }
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 8)
}
