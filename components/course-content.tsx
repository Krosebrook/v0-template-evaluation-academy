"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, CheckCircle, ArrowLeft } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  content?: string
  duration_minutes: number
}

interface CourseProgress {
  id: string
  completed: boolean
  quiz_score?: number
}

export function CourseContent({
  course,
  progress,
}: {
  course: Course
  progress: CourseProgress | null
}) {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const steps = [
    {
      title: "Course Overview",
      content: course.description,
    },
    {
      title: "Course Material",
      content: course.content || "Course content will be available soon.",
    },
    {
      title: "Quiz",
      content: "Test your knowledge",
    },
  ]

  const handleComplete = async () => {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Simulate quiz score (in real implementation, this would be calculated from quiz answers)
      const quizScore = Math.floor(Math.random() * 20) + 80 // Random score between 80-100

      if (progress) {
        // Update existing progress
        const { error } = await supabase
          .from("user_course_progress")
          .update({
            completed: true,
            quiz_score: quizScore,
            completed_at: new Date().toISOString(),
          })
          .eq("id", progress.id)

        if (error) throw error
      } else {
        // Create new progress
        const { error } = await supabase.from("user_course_progress").insert({
          user_id: user.id,
          course_id: course.id,
          completed: true,
          quiz_score: quizScore,
          completed_at: new Date().toISOString(),
        })

        if (error) throw error
      }

      router.push("/training/certification")
      router.refresh()
    } catch (error) {
      console.error("Error completing course:", error)
      alert("Failed to complete course")
    } finally {
      setLoading(false)
    }
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div>
      <Link href="/training/certification">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Certification
        </Button>
      </Link>

      <Card className="p-8 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">{course.duration_minutes} minutes</p>
          </div>
        </div>

        {progress?.completed && (
          <Badge variant="secondary" className="bg-green-500/10 text-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed - Score: {progress.quiz_score}%
          </Badge>
        )}
      </Card>

      <Card className="p-8 mb-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="prose prose-sm max-w-none mb-8">
          <p className="text-muted-foreground">{steps[currentStep].content}</p>
        </div>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button onClick={() => setCurrentStep(currentStep + 1)}>Next</Button>
          ) : (
            <Button onClick={handleComplete} disabled={loading || progress?.completed}>
              {loading ? "Completing..." : progress?.completed ? "Already Completed" : "Complete Course"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
