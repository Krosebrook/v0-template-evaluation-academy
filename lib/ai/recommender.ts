export interface Recommendation {
  templateId: string
  score: number
  reason: string
}

export function generateRecommendations(
  userId: string,
  userHistory: {
    viewedTemplates: string[]
    generatedTemplates: string[]
    favoriteCategories: string[]
    favoriteTags: string[]
  },
  allTemplates: any[],
): Recommendation[] {
  const recommendations: Recommendation[] = []

  for (const template of allTemplates) {
    if (userHistory.viewedTemplates.includes(template.id)) continue

    let score = 0
    const reasons: string[] = []

    if (userHistory.favoriteCategories.includes(template.category)) {
      score += 0.3
      reasons.push("matches your favorite category")
    }

    const matchingTags = template.tags?.filter((tag: string) => userHistory.favoriteTags.includes(tag)) || []
    if (matchingTags.length > 0) {
      score += matchingTags.length * 0.15
      reasons.push(`${matchingTags.length} matching tags`)
    }

    if (template.views > 100) {
      score += 0.2
      reasons.push("popular template")
    }

    if (template.rating >= 4.5) {
      score += 0.15
      reasons.push("highly rated")
    }

    if (score > 0) {
      recommendations.push({
        templateId: template.id,
        score: Math.min(score, 1.0),
        reason: reasons.join(", "),
      })
    }
  }

  return recommendations.sort((a, b) => b.score - a.score).slice(0, 10)
}
