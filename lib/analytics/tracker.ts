export interface AnalyticsEvent {
  event: string
  properties?: Record<string, unknown>
  userId?: string
  timestamp?: string
}

export async function trackEvent(event: string, properties?: Record<string, unknown>) {
  try {
    const eventData: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date().toISOString(),
    }

    console.log("[v0] Analytics event:", eventData)

    // In production, send to analytics service
    if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
      // Send to Vercel Analytics
      if (window.va) {
        window.va("track", event, properties)
      }
    }

    // Store in database for internal analytics
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    })
  } catch (error) {
    console.error("[v0] Analytics error:", error)
  }
}

export function trackPageView(path: string) {
  trackEvent("page_view", { path })
}

export function trackTemplateView(templateId: string) {
  trackEvent("template_view", { templateId })
}

export function trackTemplateGeneration(templateId: string, score: number) {
  trackEvent("template_generation", { templateId, score })
}

export function trackSearch(query: string, resultsCount: number) {
  trackEvent("search", { query, resultsCount })
}

declare global {
  interface Window {
    va?: (event: string, name: string, properties?: Record<string, unknown>) => void
  }
}
