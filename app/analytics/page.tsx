import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default async function AnalyticsPage() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin" && profile?.role !== "evaluator") {
    redirect("/")
  }

  const { data: templates } = await supabase.from("templates").select("*")

  const { data: evaluations } = await supabase.from("evaluations").select("*")

  const { data: users } = await supabase.from("profiles").select("*")

  const { data: comments } = await supabase.from("comments").select("*")

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
        <AnalyticsDashboard
          templates={templates || []}
          evaluations={evaluations || []}
          users={users || []}
          comments={comments || []}
        />
      </div>
    </div>
  )
}
