import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Share2, Heart, TrendingUp } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TemplateAnalyticsPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get template
  const { data: template } = await supabase.from("templates").select("*").eq("id", params.id).single()

  if (!template || template.author_id !== user.id) {
    redirect("/")
  }

  // Get analytics data
  const { data: analytics } = await supabase
    .from("template_analytics")
    .select("*")
    .eq("template_id", params.id)
    .order("created_at", { ascending: false })

  // Calculate metrics
  const totalViews = analytics?.filter((a) => a.event_type === "view").length || 0
  const totalDownloads = analytics?.filter((a) => a.event_type === "download").length || 0
  const totalShares = analytics?.filter((a) => a.event_type === "share").length || 0
  const totalFavorites = analytics?.filter((a) => a.event_type === "favorite").length || 0

  // Calculate average time spent
  const viewsWithDuration = analytics?.filter((a) => a.event_type === "view" && a.duration_seconds) || []
  const avgTimeSpent =
    viewsWithDuration.length > 0
      ? viewsWithDuration.reduce((sum, a) => sum + (a.duration_seconds || 0), 0) / viewsWithDuration.length
      : 0

  // Device breakdown
  const deviceCounts = analytics?.reduce(
    (acc, a) => {
      if (a.device_type) {
        acc[a.device_type] = (acc[a.device_type] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  // Get conversion funnel
  const { data: funnel } = await supabase
    .from("conversion_funnels")
    .select("*")
    .eq("template_id", params.id)
    .order("date", { ascending: false })
    .limit(30)

  const totalFunnelViews = funnel?.reduce((sum, f) => sum + f.views, 0) || 0
  const totalDetailViews = funnel?.reduce((sum, f) => sum + f.detail_views, 0) || 0
  const totalEvaluations = funnel?.reduce((sum, f) => sum + f.evaluations_completed, 0) || 0

  const conversionRate = totalFunnelViews > 0 ? ((totalEvaluations / totalFunnelViews) * 100).toFixed(1) : "0.0"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Template Analytics</h1>
        <p className="text-muted-foreground">{template.title}</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-5 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shares</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShares}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFavorites}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgTimeSpent)}s</div>
            <p className="text-xs text-muted-foreground">Per visit</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="journey">User Journey</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Last 30 days of template interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.slice(0, 20).map((event) => (
                  <div key={event.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {event.event_type}
                      </Badge>
                      <span className="text-muted-foreground">{event.device_type || "Unknown device"}</span>
                    </div>
                    <span className="text-muted-foreground">{new Date(event.created_at).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>User journey from discovery to evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Views</span>
                    <span className="font-medium">{totalFunnelViews}</span>
                  </div>
                  <div className="h-12 bg-blue-500 rounded" style={{ width: "100%" }} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Detail Views</span>
                    <span className="font-medium">{totalDetailViews}</span>
                  </div>
                  <div
                    className="h-12 bg-blue-400 rounded"
                    style={{ width: `${totalFunnelViews > 0 ? (totalDetailViews / totalFunnelViews) * 100 : 0}%` }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Evaluations</span>
                    <span className="font-medium">{totalEvaluations}</span>
                  </div>
                  <div
                    className="h-12 bg-blue-300 rounded"
                    style={{ width: `${totalFunnelViews > 0 ? (totalEvaluations / totalFunnelViews) * 100 : 0}%` }}
                  />
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Conversion Rate</span>
                    <Badge variant="default" className="text-lg px-4 py-2">
                      {conversionRate}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>Views by device type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(deviceCounts || {}).map(([device, count]) => (
                  <div key={device} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{device}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${(count / totalViews) * 100}%` }} />
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journey" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Journey</CardTitle>
              <CardDescription>Common paths users take</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">User journey visualization coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
