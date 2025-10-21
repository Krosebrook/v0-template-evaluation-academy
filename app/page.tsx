import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardWidgets } from "@/components/dashboard/dashboard-widgets"

async function withTimeout<T>(promise: Promise<T>, timeoutMs = 8000): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Query timeout")), timeoutMs),
  )
  return Promise.race([promise, timeoutPromise])
}

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  try {
    const [profileResult, countsResult, userTemplatesResult, userEvaluationsResult, recentTemplatesResult] =
      await Promise.allSettled([
        withTimeout(supabase.from("profiles").select("*").eq("id", user.id).single()),
        withTimeout(
          Promise.all([
            supabase.from("templates").select("*", { count: "exact", head: true }),
            supabase.from("evaluations").select("*", { count: "exact", head: true }),
            supabase.from("profiles").select("*", { count: "exact", head: true }),
          ]),
        ),
        withTimeout(
          supabase
            .from("templates")
            .select("*")
            .eq("submitted_by", user.id)
            .order("created_at", { ascending: false })
            .limit(5),
        ),
        withTimeout(
          supabase
            .from("evaluations")
            .select("*, templates(title)")
            .eq("evaluator_id", user.id)
            .order("created_at", { ascending: false })
            .limit(5),
        ),
        withTimeout(supabase.from("templates").select("*").order("created_at", { ascending: false }).limit(10)),
      ])

    const profile = profileResult.status === "fulfilled" ? profileResult.value.data : null
    const counts = countsResult.status === "fulfilled" ? countsResult.value : [{ count: 0 }, { count: 0 }, { count: 0 }]
    const userTemplates = userTemplatesResult.status === "fulfilled" ? userTemplatesResult.value.data || [] : []
    const userEvaluations = userEvaluationsResult.status === "fulfilled" ? userEvaluationsResult.value.data || [] : []
    const recentTemplates = recentTemplatesResult.status === "fulfilled" ? recentTemplatesResult.value.data || [] : []

    const submitterIds = recentTemplates ? [...new Set(recentTemplates.map((t) => t.submitted_by).filter(Boolean))] : []
    let profiles: any[] = []

    if (submitterIds.length > 0) {
      try {
        const { data } = await withTimeout(
          supabase.from("profiles").select("id, display_name, avatar_url").in("id", submitterIds),
          3000,
        )
        profiles = data || []
      } catch (error) {
        console.error("[v0] Error fetching profiles:", error)
      }
    }

    const profileMap = new Map(profiles.map((p) => [p.id, p]))
    const recentTemplatesWithProfiles = recentTemplates.map((template) => ({
      ...template,
      profiles: profileMap.get(template.submitted_by) || null,
    }))

    const dashboardData = {
      user,
      profile,
      stats: {
        templates: counts[0]?.count || 0,
        evaluations: counts[1]?.count || 0,
        users: counts[2]?.count || 0,
      },
      userTemplates,
      userEvaluations,
      recentTemplates: recentTemplatesWithProfiles,
      notifications: [],
    }

    return (
      <DashboardShell>
        <DashboardHeader user={user} profile={profile} />
        <DashboardWidgets data={dashboardData} />
      </DashboardShell>
    )
  } catch (error) {
    console.error("[v0] Dashboard data fetch error:", error)

    return (
      <DashboardShell>
        <DashboardHeader user={user} profile={null} />
        <DashboardWidgets
          data={{
            user,
            profile: null,
            stats: { templates: 0, evaluations: 0, users: 0 },
            userTemplates: [],
            userEvaluations: [],
            recentTemplates: [],
            notifications: [],
          }}
        />
      </DashboardShell>
    )
  }
}
