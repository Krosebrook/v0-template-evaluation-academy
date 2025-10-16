import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, Users, FileText } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PlatformAnalyticsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("user_profiles").select("role").eq("user_id", user.id).single()

  if (profile?.role !== "admin" && profile?.role !== "evaluator") {
    redirect("/")
  }

  // Get latest platform metrics
  const { data: latestMetrics } = await supabase
    .from("platform_metrics")
    .select("*")
    .order("date", { ascending: false })
    .limit(1)
    .single()

  // Get metrics for last 30 days
  const { data: monthlyMetrics } = await supabase
    .from("platform_metrics")
    .select("*")
    .gte("date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order("date", { ascending: false })

  // Get user growth
  const { count: totalUsers } = await supabase.from("user_profiles").select("*", { count: "exact", head: true })

  // Get template stats
  const { count: totalTemplates } = await supabase.from("templates").select("*", { count: "exact", head: true })

  const { count: pendingTemplates } = await supabase
    .from("templates")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  // Get evaluation stats
  const { count: totalEvaluations } = await supabase.from("evaluations").select("*", { count: "exact", head: true })

  // Get category distribution
  const { data: categoryStats } = await supabase
    .from("templates")
    .select("category")
    .then((result) => {
      const counts: Record<string, number> = {}
      result.data?.forEach((t) => {
        counts[t.category] = (counts[t.category] || 0) + 1
      })
      return Object.entries(counts).map(([category, count]) => ({ category, count }))
    })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Platform Analytics</h1>
          <p className="text-muted-foreground">Comprehensive platform metrics and reporting</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">+{latestMetrics?.new_users || 0} new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTemplates || 0}</div>
            <p className="text-xs text-muted-foreground">{pendingTemplates || 0} pending review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Evaluations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvaluations || 0}</div>
            <p className="text-xs text-muted-foreground">
              Avg score: {latestMetrics?.avg_evaluation_score?.toFixed(1) || "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestMetrics?.active_users || 0}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>30-Day Trends</CardTitle>
              <CardDescription>Platform activity over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyMetrics?.slice(0, 10).map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{new Date(metric.date).toLocaleDateString()}</span>
                    <div className="flex gap-4 text-sm">
                      <span>Users: {metric.active_users}</span>
                      <span>Templates: {metric.new_templates}</span>
                      <span>Evaluations: {metric.new_evaluations}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>User registration and activity trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Total Registered Users</p>
                    <p className="text-sm text-muted-foreground">All time</p>
                  </div>
                  <Badge variant="default" className="text-lg px-4 py-2">
                    {totalUsers}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Active Users (7 days)</p>
                    <p className="text-sm text-muted-foreground">Logged in within last week</p>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {latestMetrics?.active_users || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Templates by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryStats?.map((stat) => (
                  <div key={stat.category} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{stat.category}</span>
                    <Badge variant="outline">{stat.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>User locations worldwide</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">Geographic data visualization coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
