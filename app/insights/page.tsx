import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function InsightsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user's templates with insights
  const { data: insights } = await supabase
    .from("evaluation_insights")
    .select("*")
    .eq("author_id", user.id)
    .order("overall_score", { ascending: false })

  // Get improvement suggestions
  const { data: suggestions } = await supabase
    .from("improvement_suggestions")
    .select("*, templates(title)")
    .in("template_id", insights?.map((i) => i.template_id) || [])
    .eq("status", "open")
    .order("priority", { ascending: false })
    .limit(10)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Evaluation Insights</h1>
        <p className="text-muted-foreground">Detailed analytics and improvement suggestions for your templates</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Evaluations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights?.reduce((sum, i) => sum + (i.total_evaluations || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights?.length
                ? (insights.reduce((sum, i) => sum + (i.overall_score || 0), 0) / insights.length).toFixed(1)
                : "0.0"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suggestions?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Template Performance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Template Performance</CardTitle>
          <CardDescription>Score breakdown by evaluation criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {insights?.map((insight) => (
              <div key={insight.template_id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Link href={`/templates/${insight.template_id}`} className="font-semibold hover:underline">
                    {insight.template_name}
                  </Link>
                  <Badge variant={insight.overall_score >= 7 ? "default" : "secondary"}>
                    {insight.overall_score?.toFixed(1) || "N/A"} / 10
                  </Badge>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Code Quality</span>
                      <span className="font-medium">{insight.avg_code_quality?.toFixed(1) || "N/A"}</span>
                    </div>
                    <Progress value={(insight.avg_code_quality || 0) * 10} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Documentation</span>
                      <span className="font-medium">{insight.avg_documentation?.toFixed(1) || "N/A"}</span>
                    </div>
                    <Progress value={(insight.avg_documentation || 0) * 10} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Usability</span>
                      <span className="font-medium">{insight.avg_usability?.toFixed(1) || "N/A"}</span>
                    </div>
                    <Progress value={(insight.avg_usability || 0) * 10} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Design</span>
                      <span className="font-medium">{insight.avg_design?.toFixed(1) || "N/A"}</span>
                    </div>
                    <Progress value={(insight.avg_design || 0) * 10} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Performance</span>
                      <span className="font-medium">{insight.avg_performance?.toFixed(1) || "N/A"}</span>
                    </div>
                    <Progress value={(insight.avg_performance || 0) * 10} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Innovation</span>
                      <span className="font-medium">{insight.avg_innovation?.toFixed(1) || "N/A"}</span>
                    </div>
                    <Progress value={(insight.avg_innovation || 0) * 10} />
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {insight.total_evaluations} evaluation{insight.total_evaluations !== 1 ? "s" : ""} • Last evaluated{" "}
                  {insight.last_evaluation_date ? new Date(insight.last_evaluation_date).toLocaleDateString() : "Never"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Improvement Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Improvement Suggestions</CardTitle>
          <CardDescription>Actionable recommendations based on evaluations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions?.map((suggestion) => (
              <div key={suggestion.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="mt-1">
                  {suggestion.priority === "high" ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : suggestion.priority === "medium" ? (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{suggestion.category.replace("_", " ")}</Badge>
                    <Badge
                      variant={
                        suggestion.priority === "high"
                          ? "destructive"
                          : suggestion.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <p className="text-sm">{suggestion.suggestion}</p>
                  <p className="text-xs text-muted-foreground">Template: {(suggestion as any).templates?.title}</p>
                </div>
              </div>
            ))}
            {!suggestions?.length && (
              <p className="text-center text-muted-foreground py-8">No improvement suggestions at this time</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
