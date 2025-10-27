import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"
import { withTimeout } from "@/lib/utils"

export default async function AdminPage() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await withTimeout(supabase.auth.getUser(), 5000)

    if (!user) {
      redirect("/auth/login?redirect=/admin")
    }

    const { data: profile } = await withTimeout(
      supabase.from("profiles").select("role").eq("id", user.id).single(),
      3000,
    )

    if (!profile || profile.role !== "admin") {
      redirect("/?error=unauthorized")
    }

    const [usersResult, templatesResult, evaluationsResult] = await Promise.allSettled([
      withTimeout(supabase.from("profiles").select("*").order("created_at", { ascending: false }), 8000),
      withTimeout(
        supabase.from("templates").select("*, profiles(display_name, email)").order("created_at", { ascending: false }),
        8000,
      ),
      withTimeout(
        supabase
          .from("evaluations")
          .select("*, templates(title), profiles(display_name)")
          .order("created_at", { ascending: false }),
        8000,
      ),
    ])

    const users = usersResult.status === "fulfilled" ? usersResult.value.data || [] : []
    const templates = templatesResult.status === "fulfilled" ? templatesResult.value.data || [] : []
    const evaluations = evaluationsResult.status === "fulfilled" ? evaluationsResult.value.data || [] : []

    return <AdminDashboard users={users} templates={templates} evaluations={evaluations} currentUserId={user.id} />
  } catch (error) {
    console.error("[v0] Admin page error:", error)
    redirect("/?error=admin-load-failed")
  }
}
