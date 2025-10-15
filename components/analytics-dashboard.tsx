"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, FileText, Star, MessageSquare, Award, Activity } from "lucide-react"
import { useMemo } from "react"

interface AnalyticsDashboardProps {
  templates: any[]
  evaluations: any[]
  users: any[]
  comments: any[]
}

export function AnalyticsDashboard({ templates, evaluations, users, comments }: AnalyticsDashboardProps) {
  const stats = useMemo(() => {
    const totalTemplates = templates.length
    const totalEvaluations = evaluations.length
    const totalUsers = users.length
    const totalComments = comments.length

    const avgEvaluationsPerTemplate = totalTemplates > 0 ? (totalEvaluations / totalTemplates).toFixed(1) : "0"

    const categoryBreakdown = templates.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const difficultyBreakdown = templates.reduce(
      (acc, t) => {
        acc[t.difficulty] = (acc[t.difficulty] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const statusBreakdown = templates.reduce(
      (acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const roleBreakdown = users.reduce(
      (acc, u) => {
        acc[u.role] = (acc[u.role] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const avgScores = evaluations.reduce(
      (acc, e) => {
        acc.code_quality += e.code_quality || 0
        acc.documentation += e.documentation || 0
        acc.design += e.design || 0
        acc.functionality += e.functionality || 0
        acc.performance += e.performance || 0
        acc.innovation += e.innovation || 0
        return acc
      },
      { code_quality: 0, documentation: 0, design: 0, functionality: 0, performance: 0, innovation: 0 },
    )

    if (totalEvaluations > 0) {
      Object.keys(avgScores).forEach((key) => {
        avgScores[key as keyof typeof avgScores] /= totalEvaluations
      })
    }

    const topTemplates = templates
      .map((t) => {
        const templateEvals = evaluations.filter((e) => e.template_id === t.id)
        const avgScore =
          templateEvals.length > 0
            ? templateEvals.reduce((sum, e) => {
                return (
                  sum +
                  ((e.code_quality + e.documentation + e.design + e.functionality + e.performance + e.innovation) / 6 ||
                    0)
                )
              }, 0) / templateEvals.length
            : 0
        return { ...t, avgScore, evalCount: templateEvals.length }
      })
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5)

    const topEvaluators = users
      .filter((u) => u.role === "evaluator" || u.role === "admin")
      .map((u) => {
        const userEvals = evaluations.filter((e) => e.evaluator_id === u.id)
        return { ...u, evalCount: userEvals.length }
      })
      .sort((a, b) => b.evalCount - a.evalCount)
      .slice(0, 5)

    const recentActivity = [
      ...templates.slice(-5).map((t) => ({ type: "template", data: t, date: t.created_at })),
      ...evaluations.slice(-5).map((e) => ({ type: "evaluation", data: e, date: e.created_at })),
      ...comments.slice(-5).map((c) => ({ type: "comment", data: c, date: c.created_at })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)

    return {
      totalTemplates,
      totalEvaluations,
      totalUsers,
      totalComments,
      avgEvaluationsPerTemplate,
      categoryBreakdown,
      difficultyBreakdown,
      statusBreakdown,
      roleBreakdown,
      avgScores,
      topTemplates,
      topEvaluators,
      recentActivity,
    }
  }, [templates, evaluations, users, comments])

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTemplates}</div>
            <p className="text-xs text-muted-foreground">
              {stats.avgEvaluationsPerTemplate} avg evaluations per template
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Evaluations</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvaluations}</div>
            <p className="text-xs text-muted-foreground">Across all templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.roleBreakdown.evaluator || 0} evaluators, {stats.roleBreakdown.admin || 0} admins
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            <p className="text-xs text-muted-foreground">Community discussions</p>
          </CardContent>
        </Card>
      </div>

      {/* Category & Difficulty Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Templates by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{category}</span>
                  <span className="font-medium">{count}</span>
                </div>
                <Progress value={(count / stats.totalTemplates) * 100} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Templates by Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.difficultyBreakdown).map(([difficulty, count]) => (
              <div key={difficulty} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{difficulty}</span>
                  <span className="font-medium">{count}</span>
                </div>
                <Progress value={(count / stats.totalTemplates) * 100} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Average Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Average Evaluation Scores
          </CardTitle>
          <CardDescription>Across all evaluations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(stats.avgScores).map(([criterion, score]) => (
            <div key={criterion} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize">{criterion.replace("_", " ")}</span>
                <span className="font-medium">{typeof score === "number" ? score.toFixed(1) : "0"}/10</span>
              </div>
              <Progress value={typeof score === "number" ? (score / 10) * 100 : 0} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Templates & Evaluators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Rated Templates</CardTitle>
            <CardDescription>Based on average evaluation scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topTemplates.map((template, index) => (
                <div key={template.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{template.title}</p>
                      <p className="text-xs text-muted-foreground">{template.evalCount} evaluations</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{template.avgScore.toFixed(1)}/10</Badge>
                </div>
              ))}
              {stats.topTemplates.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No templates evaluated yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Evaluators</CardTitle>
            <CardDescription>Most active evaluators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topEvaluators.map((evaluator, index) => (
                <div key={evaluator.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{evaluator.display_name || "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground capitalize">{evaluator.role}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{evaluator.evalCount} evaluations</Badge>
                </div>
              ))}
              {stats.topEvaluators.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No evaluators yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <div className="mt-1">
                  {activity.type === "template" && <FileText className="h-4 w-4 text-blue-500" />}
                  {activity.type === "evaluation" && <Star className="h-4 w-4 text-yellow-500" />}
                  {activity.type === "comment" && <MessageSquare className="h-4 w-4 text-green-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    {activity.type === "template" && `New template: ${activity.data.title}`}
                    {activity.type === "evaluation" && "New evaluation submitted"}
                    {activity.type === "comment" && "New comment posted"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
