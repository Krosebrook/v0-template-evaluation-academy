import type { Template } from "@/types/database"

export interface QualityScore {
  overall: number
  completeness: number
  clarity: number
  uniqueness: number
  engagement: number
  analysis: {
    strengths: string[]
    improvements: string[]
  }
}

export function calculateQualityScore(template: Template): QualityScore {
  const scores = {
    completeness: calculateCompleteness(template),
    clarity: calculateClarity(template),
    uniqueness: calculateUniqueness(template),
    engagement: calculateEngagement(template),
  }

  const overall = Math.round(
    scores.completeness * 0.25 + scores.clarity * 0.25 + scores.uniqueness * 0.25 + scores.engagement * 0.25,
  )

  const strengths: string[] = []
  const improvements: string[] = []

  if (scores.completeness >= 80) strengths.push("Well-documented with complete information")
  else if (scores.completeness < 60) improvements.push("Add more details and documentation")

  if (scores.clarity >= 80) strengths.push("Clear and easy to understand")
  else if (scores.clarity < 60) improvements.push("Improve clarity and structure")

  if (scores.uniqueness >= 80) strengths.push("Unique and innovative approach")
  else if (scores.uniqueness < 60) improvements.push("Add more unique features or perspectives")

  if (scores.engagement >= 80) strengths.push("High user engagement and popularity")
  else if (scores.engagement < 60) improvements.push("Increase visibility and user engagement")

  return {
    overall,
    ...scores,
    analysis: { strengths, improvements },
  }
}

function calculateCompleteness(template: Template): number {
  let score = 0

  if (template.title && template.title.length >= 10) score += 20
  if (template.description && template.description.length >= 100) score += 30
  if (template.content && template.content.length >= 200) score += 30
  if (template.tags && template.tags.length >= 3) score += 20

  return Math.min(score, 100)
}

function calculateClarity(template: Template): number {
  let score = 50

  const description = template.description || ""
  const words = description.split(/\s+/).length

  if (words >= 50) score += 20
  if (words >= 100) score += 10

  if (description.includes("?") || description.includes("!")) score += 10

  const sentences = description.split(/[.!?]+/).filter((s: string) => s.trim().length > 0)
  const avgSentenceLength = words / Math.max(sentences.length, 1)
  if (avgSentenceLength >= 10 && avgSentenceLength <= 25) score += 10

  return Math.min(score, 100)
}

function calculateUniqueness(template: Template): number {
  let score = 60

  const title = template.title || ""
  const description = template.description || ""

  const uniqueWords = new Set(description.toLowerCase().split(/\s+/))
  if (uniqueWords.size >= 50) score += 20

  if (title.length >= 20) score += 10
  if (template.tags && template.tags.length >= 5) score += 10

  return Math.min(score, 100)
}

function calculateEngagement(template: Template): number {
  const views = template.views || 0
  const generations = template.generations || 0

  let score = 0

  if (views >= 100) score += 25
  else if (views >= 50) score += 15
  else if (views >= 10) score += 5

  if (generations >= 50) score += 25
  else if (generations >= 20) score += 15
  else if (generations >= 5) score += 5

  const conversionRate = views > 0 ? generations / views : 0
  if (conversionRate >= 0.3) score += 25
  else if (conversionRate >= 0.15) score += 15
  else if (conversionRate >= 0.05) score += 5

  score += 25

  return Math.min(score, 100)
}
