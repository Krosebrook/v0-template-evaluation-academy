import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { templateId, url } = await request.json()

    // Simulate performance monitoring (in production, use real tools like Lighthouse CI)
    const metrics = {
      lcp: Math.random() * 3000 + 1000, // 1-4 seconds
      fid: Math.random() * 200 + 50, // 50-250ms
      cls: Math.random() * 0.2, // 0-0.2
      ttfb: Math.random() * 500 + 100, // 100-600ms
      fcp: Math.random() * 2000 + 500, // 500-2500ms
    }

    // Insert metrics
    for (const [metricType, value] of Object.entries(metrics)) {
      await supabase.from("performance_metrics").insert({
        template_id: templateId,
        metric_type: metricType,
        value,
        url,
        device_type: "desktop",
      })
    }

    // Simulate uptime check
    const uptimeCheck = {
      template_id: templateId,
      status_code: 200,
      response_time: Math.random() * 300 + 100,
      is_up: true,
    }

    await supabase.from("uptime_checks").insert(uptimeCheck)

    // Check for performance degradation and create alerts
    if (metrics.lcp > 4000) {
      await supabase.from("performance_alerts").insert({
        template_id: templateId,
        alert_type: "performance_degradation",
        severity: "high",
        message: "LCP exceeds 4 seconds - poor user experience",
      })
    }

    return NextResponse.json({ success: true, metrics })
  } catch (error) {
    console.error("[v0] Performance monitoring error:", error)
    return NextResponse.json({ error: "Failed to monitor performance" }, { status: 500 })
  }
}
