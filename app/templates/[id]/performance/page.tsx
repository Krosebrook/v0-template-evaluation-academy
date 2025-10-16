import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingUp, Activity } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TemplatePerformancePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createServerClient()

  // Fetch template
  const { data: template } = await supabase.from("templates").select("*").eq("id", params.id).single()

  if (!template) notFound()

  // Fetch performance summary
  const { data: summary } = await supabase.from("performance_summary").select("*").eq("template_id", params.id).single()

  // Fetch recent metrics
  const { data: recentMetrics } = await supabase
    .from("performance_metrics")
    .select("*")
    .eq("template_id", params.id)
    .order("created_at", { ascending: false })
    .limit(100)

  // Fetch uptime history
  const { data: uptimeHistory } = await supabase
    .from("uptime_checks")
    .select("*")
    .eq("template_id", params.id)
    .order("checked_at", { ascending: false })
    .limit(100)

  // Fetch active alerts
  const { data: alerts } = await supabase
    .from("performance_alerts")
    .select("*")
    .eq("template_id", params.id)
    .eq("is_resolved", false)
    .order("created_at", { ascending: false })

  // Calculate Core Web Vitals scores
  const lcpScore = summary?.avg_lcp ? (summary.avg_lcp < 2500 ? 100 : summary.avg_lcp < 4000 ? 50 : 0) : 0
  const fidScore = summary?.avg_fid ? (summary.avg_fid < 100 ? 100 : summary.avg_fid < 300 ? 50 : 0) : 0
  const clsScore = summary?.avg_cls ? (summary.avg_cls < 0.1 ? 100 : summary.avg_cls < 0.25 ? 50 : 0) : 0

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{template.title}</h1>
        <p className="text-muted-foreground">Performance Monitoring Dashboard</p>
      </div>

      {/* Active Alerts */}
      {alerts && alerts.length > 0 && (
        <Card className="p-6 mb-6 border-destructive">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Active Alerts ({alerts.length})</h3>
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between">
                    <span className="text-sm">{alert.message}</span>
                    <Badge
                      variant={
                        alert.severity === "critical"
                          ? "destructive"
                          : alert.severity === "high"
                            ? "destructive"
                            : alert.severity === "medium"
                              ? "default"
                              : "secondary"
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Core Web Vitals */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">LCP (Largest Contentful Paint)</h3>
            <Badge variant={lcpScore === 100 ? "default" : lcpScore === 50 ? "secondary" : "destructive"}>
              {lcpScore === 100 ? "Good" : lcpScore === 50 ? "Needs Improvement" : "Poor"}
            </Badge>
          </div>
          <div className="text-3xl font-bold mb-2">
            {summary?.avg_lcp ? `${(summary.avg_lcp / 1000).toFixed(2)}s` : "N/A"}
          </div>
          <Progress value={lcpScore} className="mb-2" />
          <p className="text-sm text-muted-foreground">Target: &lt; 2.5s</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">FID (First Input Delay)</h3>
            <Badge variant={fidScore === 100 ? "default" : fidScore === 50 ? "secondary" : "destructive"}>
              {fidScore === 100 ? "Good" : fidScore === 50 ? "Needs Improvement" : "Poor"}
            </Badge>
          </div>
          <div className="text-3xl font-bold mb-2">{summary?.avg_fid ? `${summary.avg_fid.toFixed(0)}ms` : "N/A"}</div>
          <Progress value={fidScore} className="mb-2" />
          <p className="text-sm text-muted-foreground">Target: &lt; 100ms</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">CLS (Cumulative Layout Shift)</h3>
            <Badge variant={clsScore === 100 ? "default" : clsScore === 50 ? "secondary" : "destructive"}>
              {clsScore === 100 ? "Good" : clsScore === 50 ? "Needs Improvement" : "Poor"}
            </Badge>
          </div>
          <div className="text-3xl font-bold mb-2">{summary?.avg_cls ? summary.avg_cls.toFixed(3) : "N/A"}</div>
          <Progress value={clsScore} className="mb-2" />
          <p className="text-sm text-muted-foreground">Target: &lt; 0.1</p>
        </Card>
      </div>

      {/* Uptime & Response Time */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5" />
            <h3 className="font-semibold">Uptime (30 days)</h3>
          </div>
          <div className="text-3xl font-bold mb-2">
            {summary?.uptime_percentage ? `${summary.uptime_percentage.toFixed(2)}%` : "N/A"}
          </div>
          <Progress value={summary?.uptime_percentage || 0} className="mb-2" />
          <p className="text-sm text-muted-foreground">Target: 99.9% uptime</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5" />
            <h3 className="font-semibold">Avg Response Time</h3>
          </div>
          <div className="text-3xl font-bold mb-2">
            {summary?.avg_response_time ? `${summary.avg_response_time.toFixed(0)}ms` : "N/A"}
          </div>
          <Progress
            value={summary?.avg_response_time ? Math.min((1000 - summary.avg_response_time) / 10, 100) : 0}
            className="mb-2"
          />
          <p className="text-sm text-muted-foreground">Target: &lt; 200ms</p>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Performance Trends (Last 30 Days)</h3>
        <div className="space-y-4">
          {recentMetrics && recentMetrics.length > 0 ? (
            <div className="text-sm text-muted-foreground">
              <p>Tracking {recentMetrics.length} data points across all metrics</p>
              <p className="mt-2">Latest check: {new Date(recentMetrics[0].created_at).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No performance data available yet</p>
          )}
        </div>
      </Card>
    </div>
  )
}
