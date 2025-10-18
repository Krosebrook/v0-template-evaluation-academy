import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import {
  Sparkles,
  FileText,
  Users,
  TrendingUp,
  Award,
  Layers,
  Clock,
  ArrowRight,
  BarChart3,
  Settings,
  BookOpen,
} from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { count: templatesCount } = await supabase.from("templates").select("*", { count: "exact", head: true })

  const { count: evaluationsCount } = await supabase.from("evaluations").select("*", { count: "exact", head: true })

  const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { data: userTemplates } = await supabase
    .from("templates")
    .select("*")
    .eq("submitted_by", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: userEvaluations } = await supabase
    .from("evaluations")
    .select("*, templates(title)")
    .eq("evaluator_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: recentTemplates } = await supabase
    .from("templates")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  // Fetch profiles for recent templates
  const submitterIds = recentTemplates ? [...new Set(recentTemplates.map((t) => t.submitted_by))] : []
  const { data: profiles } = await supabase.from("profiles").select("id, display_name").in("id", submitterIds)

  // Create profile map and join data
  const profileMap = new Map(profiles?.map((p) => [p.id, p]) || [])
  const recentTemplatesWithProfiles = recentTemplates?.map((template) => ({
    ...template,
    profiles: profileMap.get(template.submitted_by) || null,
  }))

  const isAdmin = profile?.role === "admin"
  const isEvaluator = profile?.role === "evaluator" || isAdmin

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.display_name || user.email?.split("@")[0]}
          </h1>
          <p className="text-lg text-gray-600">Template Generation Academy Internal Portal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{templatesCount || 0}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Templates</h3>
            <p className="text-xs text-gray-500 mt-1">Across all categories</p>
          </Card>

          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <Award className="h-8 w-8 text-yellow-600" />
              <span className="text-3xl font-bold text-gray-900">{evaluationsCount || 0}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Evaluations</h3>
            <p className="text-xs text-gray-500 mt-1">Quality assessments</p>
          </Card>

          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">{usersCount || 0}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Team Members</h3>
            <p className="text-xs text-gray-500 mt-1">Active users</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-white border-slate-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild className="h-auto py-4 flex-col gap-2">
                <Link href="/generator">
                  <Layers className="h-5 w-5" />
                  <span className="text-sm">Generate Template</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
                <Link href="/templates">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Browse Templates</span>
                </Link>
              </Button>
              {isEvaluator && (
                <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
                  <Link href="/templates?filter=pending">
                    <Award className="h-5 w-5" />
                    <span className="text-sm">Evaluate</span>
                  </Link>
                </Button>
              )}
              {isAdmin && (
                <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
                  <Link href="/admin">
                    <Settings className="h-5 w-5" />
                    <span className="text-sm">Admin Panel</span>
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
                <Link href="/analytics/overview">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm">Analytics</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
                <Link href="/training">
                  <BookOpen className="h-5 w-5" />
                  <span className="text-sm">Training</span>
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              Your Recent Activity
            </h2>
            <div className="space-y-3">
              {userTemplates && userTemplates.length > 0 ? (
                userTemplates.slice(0, 3).map((template) => (
                  <Link
                    key={template.id}
                    href={`/templates/results/${template.id}`}
                    className="block p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{template.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{template.category}</p>
                      </div>
                      <FileText className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No templates yet. Create your first one!</p>
              )}
              {userTemplates && userTemplates.length > 3 && (
                <Link
                  href="/templates?filter=my-templates"
                  className="block text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium pt-2"
                >
                  View all your templates →
                </Link>
              )}
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-white border-slate-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Recent Platform Activity
          </h2>
          <div className="space-y-3">
            {recentTemplatesWithProfiles && recentTemplatesWithProfiles.length > 0 ? (
              recentTemplatesWithProfiles.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{template.title}</p>
                      <p className="text-xs text-gray-500">
                        by {template.profiles?.display_name || "Unknown"} •{" "}
                        {new Date(template.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Link href={`/templates/results/${template.id}`}>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </Card>

        {isAdmin && (
          <Card className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-600" />
              Admin Tools
            </h3>
            <p className="text-sm text-gray-600 mb-4">Manage users, templates, and system settings</p>
            <div className="flex gap-3">
              <Button asChild size="sm">
                <Link href="/admin">Open Admin Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/analytics">View Analytics</Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
