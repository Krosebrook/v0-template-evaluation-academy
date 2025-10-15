import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/?error=unauthorized")
  }

  // Fetch dashboard data
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  const { data: templates } = await supabase
    .from("templates")
    .select("*, profiles(display_name, email)")
    .order("created_at", { ascending: false })

  const { data: evaluations } = await supabase
    .from("evaluations")
    .select("*, templates(title), profiles(display_name)")
    .order("created_at", { ascending: false })

  return (
    <AdminDashboard
      users={users || []}
      templates={templates || []}
      evaluations={evaluations || []}
      currentUserId={user.id}
    />
  )
}
