"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, TrendingUp, Users, Award, Github, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface Evaluation {
  id: string
  code_quality_score: number
  design_score: number
  functionality_score: number
  documentation_score: number
  performance_score: number
  overall_score: number
  feedback: string
  created_at: string
  profiles: {
    display_name: string | null
    avatar_url: string | null
  } | null
}

interface Template {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  tags: string[]
  preview_url: string | null
  github_url: string | null
  demo_url: string | null
  created_at: string
  profiles: {
    display_name: string | null
    avatar_url: string | null
  } | null
  evaluations: Evaluation[]
}

const CRITERIA_LABELS = {
  code_quality_score: "Code Quality",
  design_score: "Design & UI",
  functionality_score: "Functionality",
  documentation_score: "Documentation",
  performance_score: "Performance",
  overall_score: "Overall",
}

export function ResultsDashboard({ template }: { template: Template }) {
  const evaluations = template.evaluations || []
  const hasEvaluations = evaluations.length > 0

  // Calculate average scores
  const averageScores = hasEvaluations
    ? {
        code_quality_score: evaluations.reduce((sum, e) => sum + e.code_quality_score, 0) / evaluations.length,
        design_score: evaluations.reduce((sum, e) => sum + e.design_score, 0) / evaluations.length,
        functionality_score: evaluations.reduce((sum, e) => sum + e.functionality_score, 0) / evaluations.length,
        documentation_score: evaluations.reduce((sum, e) => sum + e.documentation_score, 0) / evaluations.length,
        performance_score: evaluations.reduce((sum, e) => sum + e.performance_score, 0) / evaluations.length,
        overall_score: evaluations.reduce((sum, e) => sum + e.overall_score, 0) / evaluations.length,
      }
    : null

  const overallAverage = averageScores?.overall_score || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6">
        {template.preview_url && (
          <div className="relative w-full md:w-80 h-56 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={template.preview_url || "/placeholder.svg"}
              alt={template.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-4xl font-bold">{template.title}</h1>
              <Badge variant="outline">{template.difficulty}</Badge>
            </div>
            <p className="text-lg text-muted-foreground">{template.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {template.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {template.profiles && (
            <p className="text-sm text-muted-foreground">
              Submitted by <span className="font-medium">{template.profiles.display_name || "Anonymous"}</span>
            </p>
          )}

          <div className="flex gap-3">
            {template.github_url && (
              <a href={template.github_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Github className="w-4 h-4" />
                  View Code
                </Button>
              </a>
            )}
            {template.demo_url && (
              <a href={template.demo_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </Button>
              </a>
            )}
            <Link href={`/templates/evaluate/${template.id}`}>
              <Button size="sm" className="gap-2">
                <Star className="w-4 h-4" />
                Evaluate
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <p className="text-2xl font-bold">{hasEvaluations ? overallAverage.toFixed(1) : "N/A"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Evaluations</p>
              <p className="text-2xl font-bold">{evaluations.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="text-2xl font-bold">{template.category}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Award className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Difficulty</p>
              <p className="text-2xl font-bold">{template.difficulty}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Score Breakdown */}
      {hasEvaluations && averageScores && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Score Breakdown</h2>
          <div className="space-y-6">
            {Object.entries(CRITERIA_LABELS).map(([key, label]) => {
              const score = averageScores[key as keyof typeof averageScores]
              const percentage = (score / 10) * 100

              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{label}</span>
                    <span className="text-lg font-bold">
                      {score.toFixed(1)} <span className="text-sm text-muted-foreground">/10</span>
                    </span>
                  </div>
                  <Progress value={percentage} className="h-3" />
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Individual Evaluations */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Individual Evaluations ({evaluations.length})</h2>

        {hasEvaluations ? (
          <div className="space-y-6">
            {evaluations.map((evaluation) => (
              <div key={evaluation.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {evaluation.profiles?.avatar_url && (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={evaluation.profiles.avatar_url || "/placeholder.svg"}
                          alt={evaluation.profiles.display_name || "Evaluator"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{evaluation.profiles?.display_name || "Anonymous Evaluator"}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(evaluation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-xl font-bold">{evaluation.overall_score}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Code Quality</p>
                    <p className="font-semibold">{evaluation.code_quality_score}/10</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Design</p>
                    <p className="font-semibold">{evaluation.design_score}/10</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Functionality</p>
                    <p className="font-semibold">{evaluation.functionality_score}/10</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Documentation</p>
                    <p className="font-semibold">{evaluation.documentation_score}/10</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Performance</p>
                    <p className="font-semibold">{evaluation.performance_score}/10</p>
                  </div>
                </div>

                {evaluation.feedback && (
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium mb-2">Feedback:</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{evaluation.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-2">No evaluations yet</p>
            <p className="text-sm text-muted-foreground mb-4">Be the first to evaluate this template!</p>
            <Link href={`/templates/evaluate/${template.id}`}>
              <Button>
                <Star className="w-4 h-4 mr-2" />
                Evaluate Now
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  )
}
