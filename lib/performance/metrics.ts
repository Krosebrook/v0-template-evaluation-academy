export function measurePerformance(name: string) {
  const start = performance.now()

  return {
    end: () => {
      const duration = performance.now() - start
      console.log(`[v0] Performance: ${name} took ${duration.toFixed(2)}ms`)
      return duration
    },
  }
}

export function reportWebVitals(metric: {
  id: string
  name: string
  value: number
  label: "web-vital" | "custom"
}) {
  console.log("[v0] Web Vital:", metric)

  // In production, send to analytics
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    // Send to Vercel Analytics or Google Analytics
    // window.gtag?.('event', metric.name, { value: metric.value })
  }
}
