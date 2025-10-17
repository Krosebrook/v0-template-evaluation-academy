const INAPPROPRIATE_KEYWORDS = [
  "spam",
  "scam",
  "phishing",
  "malware",
  "virus",
  // Add more as needed
]

export async function scanContent(content: string): Promise<{
  safe: boolean
  flags: string[]
  score: number
}> {
  const flags: string[] = []
  let score = 100

  // Check for inappropriate keywords
  const lowerContent = content.toLowerCase()
  INAPPROPRIATE_KEYWORDS.forEach((keyword) => {
    if (lowerContent.includes(keyword)) {
      flags.push(`Contains inappropriate keyword: ${keyword}`)
      score -= 20
    }
  })

  // Check for excessive caps
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length
  if (capsRatio > 0.5 && content.length > 20) {
    flags.push("Excessive capitalization")
    score -= 10
  }

  // Check for excessive punctuation
  const punctRatio = (content.match(/[!?]{2,}/g) || []).length
  if (punctRatio > 3) {
    flags.push("Excessive punctuation")
    score -= 10
  }

  // Check for URLs (potential spam)
  const urlCount = (content.match(/https?:\/\//g) || []).length
  if (urlCount > 3) {
    flags.push("Multiple URLs detected")
    score -= 15
  }

  console.log("[v0] Content scan result:", { safe: score >= 50, flags, score })

  return {
    safe: score >= 50,
    flags,
    score,
  }
}

export async function scanTemplate(template: {
  name: string
  description: string
  content?: string
}): Promise<{
  safe: boolean
  flags: string[]
}> {
  const nameResult = await scanContent(template.name)
  const descResult = await scanContent(template.description)
  const contentResult = template.content ? await scanContent(template.content) : { safe: true, flags: [] }

  const allFlags = [...nameResult.flags, ...descResult.flags, ...contentResult.flags]
  const safe = nameResult.safe && descResult.safe && contentResult.safe

  return { safe, flags: allFlags }
}
