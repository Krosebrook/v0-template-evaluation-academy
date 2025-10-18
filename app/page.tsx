import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardWidgets } from "@/components/dashboard/dashboard-widgets"

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch dashboard data in parallel
  const [
    { count: templatesCount },
    { count: evaluationsCount },
    { count: usersCount },
    { data: userTemplates },
    { data: userEvaluations },
    { data: recentTemplates },
    { data: notifications },
  ] = await Promise.all([
    supabase.from("templates").select("*", { count: "exact", head: true }),
    supabase.from("evaluations").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("templates")
      .select("*")
      .eq("submitted_by", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("evaluations")
      .select("*, templates(title)")
      .eq("evaluator_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("templates").select("*").order("created_at", { ascending: false }).limit(10),
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  // Fetch profiles for recent templates
  const submitterIds = recentTemplates ? [...new Set(recentTemplates.map((t) => t.submitted_by))] : []
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", submitterIds)

  // Create profile map and join data
  const profileMap = new Map(profiles?.map((p) => [p.id, p]) || [])
  const recentTemplatesWithProfiles = recentTemplates?.map((template) => ({
    ...template,
    profiles: profileMap.get(template.submitted_by) || null,
  }))

  const dashboardData = {
    user,
    profile,
    stats: {
      templates: templatesCount || 0,
      evaluations: evaluationsCount || 0,
      users: usersCount || 0,
    },
    userTemplates: userTemplates || [],
    userEvaluations: userEvaluations || [],
    recentTemplates: recentTemplatesWithProfiles || [],
    notifications: notifications || [],
  }

  return (
    <DashboardShell>
      <DashboardHeader user={user} profile={profile} />
      <DashboardWidgets data={dashboardData} />
    </DashboardShell>
  )
}
