"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Loader2, Star, Github, ExternalLink, AlertCircle, Check, Info } from "lucide-react"
import Image from "next/image"

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
  profiles: {
    display_name: string | null
    avatar_url: string | null
  } | null
}

interface Evaluation {
  code_quality_score: number
  design_score: number
  functionality_score: number
  documentation_score: number
  performance_score: number
  overall_score: number
  feedback: string
}

const EVALUATION_CRITERIA = [
  {
    key: "code_quality_score",
    label: "Code Quality",
    description: "Clean, maintainable, follows best practices",
  },
  {
    key: "design_score",
    label: "Design & UI",
    description: "Visual appeal, user experience, responsiveness",
  },
  {
    key: "functionality_score",
    label: "Functionality",
    description: "Features work as expected, no bugs",
  },
  {
    key: "documentation_score",
    label: "Documentation",
    description: "Clear README, setup instructions, code comments",
  },
  {
    key: "performance_score",
    label: "Performance",
    description: "Load times, optimization, efficiency",
  },
  {
    key: "overall_score",
    label: "Overall Score",
    description: "Your overall impression of the template",
  },
]

export function EvaluationInterface({
  template,
  userId,
  userRole,
  existingEvaluation,
}: {
  template: Template
  userId: string
  userRole: string
  existingEvaluation: Evaluation | null
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [scores, setScores] = useState<Record<string, number>>({
    code_quality_score: existingEvaluation?.code_quality_score || 5,
    design_score: existingEvaluation?.design_score || 5,
    functionality_score: existingEvaluation?.functionality_score || 5,
    documentation_score: existingEvaluation?.documentation_score || 5,
    performance_score: existingEvaluation?.performance_score || 5,
    overall_score: existingEvaluation?.overall_score || 5,
  })

  const [feedback, setFeedback] = useState(existingEvaluation?.feedback || "")

  const isEvaluator = userRole === "evaluator" || userRole === "admin"

  const handleScoreChange = (key: string, value: number[]) => {
    setScores({ ...scores, [key]: value[0] })
  }

  const handleSubmit = async () => {
    if (!isEvaluator) {
      setError("Only evaluators can submit evaluations")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()

      const evaluationData = {
        template_id: template.id,
        evaluator_id: userId,
        ...scores,
        feedback,
      }

      if (existingEvaluation) {
        // Update existing evaluation
        const { error: updateError } = await supabase
          .from("evaluations")
          .update(evaluationData)
          .eq("template_id", template.id)
          .eq("evaluator_id", userId)

        if (updateError) throw updateError
      } else {
        // Insert new evaluation
        const { error: insertError } = await supabase.from("evaluations").insert(evaluationData)

        if (insertError) throw insertError
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/templates")
      }, 2000)
    } catch (err) {
      console.error("[v0] Error submitting evaluation:", err)
      setError(err instanceof Error ? err.message : "Failed to submit evaluation")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Evaluation Submitted!</h2>
        <p className="text-muted-foreground mb-4">
          Your evaluation has been successfully {existingEvaluation ? "updated" : "submitted"}.
        </p>
        <p className="text-sm text-muted-foreground">Redirecting to gallery...</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Template Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {template.preview_url && (
            <div className="relative w-full md:w-64 h-48 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={template.preview_url || "/placeholder.svg"}
                alt={template.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{template.title}</h1>
                <p className="text-muted-foreground">{template.description}</p>
              </div>
              <Badge variant="outline">{template.difficulty}</Badge>
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

            <div className="flex gap-3 pt-2">
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
            </div>
          </div>
        </div>
      </Card>

      {/* Evaluation Form */}
      {!isEvaluator && (
        <Card className="p-6 bg-yellow-500/10 border-yellow-500/20">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-500">Evaluator Access Required</p>
              <p className="text-sm text-yellow-500/80 mt-1">
                You need evaluator permissions to submit evaluations. Contact an administrator to request access.
              </p>
            </div>
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-6 bg-red-500/10 border-red-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-500">Error</p>
              <p className="text-sm text-red-500/80 mt-1">{error}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          {existingEvaluation ? "Update Your Evaluation" : "Evaluate This Template"}
        </h2>

        <div className="space-y-8">
          {EVALUATION_CRITERIA.map((criterion) => (
            <div key={criterion.key} className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <Label className="text-base font-semibold">{criterion.label}</Label>
                  <p className="text-sm text-muted-foreground mt-1">{criterion.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-2xl font-bold">{scores[criterion.key]}</span>
                  <span className="text-muted-foreground">/10</span>
                </div>
              </div>

              <Slider
                value={[scores[criterion.key]]}
                onValueChange={(value) => handleScoreChange(criterion.key, value)}
                min={1}
                max={10}
                step={1}
                className="w-full"
                disabled={!isEvaluator}
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Poor</span>
                <span>Average</span>
                <span>Excellent</span>
              </div>
            </div>
          ))}

          {/* Feedback */}
          <div className="space-y-3 pt-4 border-t">
            <Label htmlFor="feedback" className="text-base font-semibold">
              Detailed Feedback
            </Label>
            <Textarea
              id="feedback"
              placeholder="Provide detailed feedback about the template. What did you like? What could be improved?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[150px]"
              disabled={!isEvaluator}
            />
            <p className="text-xs text-muted-foreground">{feedback.length} characters</p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => router.back()} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !isEvaluator} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : existingEvaluation ? (
                "Update Evaluation"
              ) : (
                "Submit Evaluation"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
