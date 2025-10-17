export function measurePerformance(name: string) {
  const start = performance.now()

  return {
    end: () => {
      const duration = performance.now() - start
      if (process.env.NODE_ENV === "development") {
        console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`)
      }
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
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    // Send to Vercel Analytics or Google Analytics
    // window.gtag?.('event', metric.name, { value: metric.value })
  }
}
