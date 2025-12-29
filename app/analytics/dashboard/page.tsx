export const dynamic = "force-dynamic"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AnalyticsDashboardClient } from "@/components/analytics-dashboard-client"

export default async function AnalyticsDashboardPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/analytics/dashboard")
  }

  // Get user's templates
  const { data: templates } = await supabase
    .from("templates")
    .select("id, title, name, created_at")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })

  // Get template analytics for last 90 days
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const { data: templateAnalytics } = await supabase
    .from("template_analytics")
    .select("*")
    .in("template_id", templates?.map((t) => t.id) || [])
    .gte("date", ninetyDaysAgo.toISOString().split("T")[0])
    .order("date", { ascending: false })

  // Calculate totals for last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentAnalytics = templateAnalytics?.filter((a) => new Date(a.date) >= thirtyDaysAgo) || []

  const totalViews = recentAnalytics.reduce((sum, a) => sum + (a.views || 0), 0)
  const totalGenerations = recentAnalytics.reduce((sum, a) => sum + (a.generations || 0), 0)
  const totalShares = recentAnalytics.reduce((sum, a) => sum + (a.shares || 0), 0)
  const totalFavorites = recentAnalytics.reduce((sum, a) => sum + (a.favorites || 0), 0)

  // Get user's subscription info
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  // Get user's credits
  const { data: credits } = await supabase
    .from("credits")
    .select("balance")
    .eq("user_id", user.id)
    .single()

  const initialData = {
    totalViews,
    totalGenerations,
    totalEngagement: totalShares + totalFavorites,
    creditsBalance: credits?.balance || 0,
    templates: templates || [],
    analytics: templateAnalytics || [],
    subscription,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive insights and performance metrics for your templates
        </p>
      </div>

      <AnalyticsDashboardClient initialData={initialData} />
    </div>
  )
}
