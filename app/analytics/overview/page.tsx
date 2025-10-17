import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, DollarSign, Activity } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AnalyticsOverviewPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/analytics/overview")
  }

  // Get user's templates
  const { data: templates } = await supabase.from("templates").select("id, name, created_at").eq("author_id", user.id)

  // Get template analytics for last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: templateAnalytics } = await supabase
    .from("template_analytics")
    .select("*")
    .in("template_id", templates?.map((t) => t.id) || [])
    .gte("date", thirtyDaysAgo.toISOString().split("T")[0])
    .order("date", { ascending: false })

  // Calculate totals
  const totalViews = templateAnalytics?.reduce((sum, a) => sum + a.views, 0) || 0
  const totalGenerations = templateAnalytics?.reduce((sum, a) => sum + a.generations, 0) || 0
  const totalShares = templateAnalytics?.reduce((sum, a) => sum + a.shares, 0) || 0
  const totalFavorites = templateAnalytics?.reduce((sum, a) => sum + a.favorites, 0) || 0

  // Get user's subscription info
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  // Get user's credits
  const { data: credits } = await supabase.from("credits").select("balance").eq("user_id", user.id).single()

  // Get recent events
  const { data: recentEvents } = await supabase
    .from("user_events")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Analytics Overview</h1>
        <p className="text-muted-foreground">Comprehensive insights into your template performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generations</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGenerations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Templates generated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalShares + totalFavorites).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {totalShares} shares, {totalFavorites} favorites
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{credits?.balance || 0}</div>
            <p className="text-xs text-muted-foreground">
              {subscription ? `${subscription.plan_name} plan` : "Free plan"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Template Performance</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Performance</CardTitle>
              <CardDescription>Individual template metrics for the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              {templates && templates.length > 0 ? (
                <div className="space-y-4">
                  {templates.map((template) => {
                    const analytics = templateAnalytics?.filter((a) => a.template_id === template.id) || []
                    const views = analytics.reduce((sum, a) => sum + a.views, 0)
                    const generations = analytics.reduce((sum, a) => sum + a.generations, 0)
                    const avgRating =
                      analytics.length > 0
                        ? analytics.reduce((sum, a) => sum + (a.avg_rating || 0), 0) / analytics.length
                        : 0

                    return (
                      <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Created {new Date(template.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-8 text-center">
                          <div>
                            <p className="text-2xl font-bold">{views}</p>
                            <p className="text-xs text-muted-foreground">Views</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{generations}</p>
                            <p className="text-xs text-muted-foreground">Generations</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">Avg Rating</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No templates yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {recentEvents && recentEvents.length > 0 ? (
                <div className="space-y-3">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium capitalize">{event.event_type.replace(/_/g, " ")}</p>
                        <p className="text-sm text-muted-foreground">{new Date(event.created_at).toLocaleString()}</p>
                      </div>
                      {event.page_url && <p className="text-sm text-muted-foreground">{event.page_url}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>30-Day Trends</CardTitle>
              <CardDescription>Daily performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {templateAnalytics && templateAnalytics.length > 0 ? (
                <div className="space-y-2">
                  {Array.from(new Set(templateAnalytics.map((a) => a.date)))
                    .sort()
                    .reverse()
                    .slice(0, 14)
                    .map((date) => {
                      const dayAnalytics = templateAnalytics.filter((a) => a.date === date)
                      const dayViews = dayAnalytics.reduce((sum, a) => sum + a.views, 0)
                      const dayGenerations = dayAnalytics.reduce((sum, a) => sum + a.generations, 0)

                      return (
                        <div key={date} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm font-medium">{new Date(date).toLocaleDateString()}</span>
                          <div className="flex gap-6 text-sm">
                            <span>{dayViews} views</span>
                            <span>{dayGenerations} generations</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No trend data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
