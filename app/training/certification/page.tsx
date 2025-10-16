export const dynamic = "force-dynamic"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Award, BookOpen, CheckCircle, Lock } from "lucide-react"
import Link from "next/link"

export default async function CertificationPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch certification levels
  const { data: levels } = await supabase
    .from("certification_levels")
    .select("*")
    .order("requirements_score", { ascending: true })

  // Fetch user's certifications
  const { data: userCerts } = await supabase
    .from("user_certifications")
    .select("*, certification_levels(*)")
    .eq("user_id", user.id)
    .eq("is_active", true)

  // Fetch training courses
  const { data: courses } = await supabase
    .from("training_courses")
    .select("*")
    .order("order_index", { ascending: true })

  // Fetch user's course progress
  const { data: progress } = await supabase.from("user_course_progress").select("*").eq("user_id", user.id)

  const completedCourses = progress?.filter((p) => p.completed).length || 0
  const totalCourses = courses?.length || 0
  const progressPercentage = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0

  // Get current certification level
  const currentCert = userCerts?.[0]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Evaluator Certification</h1>
      <p className="text-muted-foreground mb-8">Complete training courses and earn certifications</p>

      {/* Current Status */}
      <Card className="p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Your Progress</h2>
            <p className="text-muted-foreground">
              {completedCourses} of {totalCourses} courses completed
            </p>
          </div>
          {currentCert && (
            <Badge
              variant="secondary"
              className="text-lg px-4 py-2"
              style={{ backgroundColor: currentCert.certification_levels.badge_color + "20" }}
            >
              <Award className="mr-2 h-5 w-5" />
              {currentCert.certification_levels.name} Certified
            </Badge>
          )}
        </div>
        <Progress value={progressPercentage} className="h-3" />
      </Card>

      {/* Certification Levels */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Certification Levels</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {levels?.map((level: any) => {
            const hasLevel = userCerts?.some((cert) => cert.level_id === level.id)
            return (
              <Card
                key={level.id}
                className={`p-6 ${hasLevel ? "border-2" : ""}`}
                style={{ borderColor: hasLevel ? level.badge_color : undefined }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Award className="h-8 w-8" style={{ color: level.badge_color }} />
                  <h3 className="text-xl font-semibold">{level.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{level.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {hasLevel ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>Quiz Score: {level.requirements_score}%+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasLevel ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{level.requirements_evaluations} Evaluations</span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Training Courses */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Training Courses</h2>
        <div className="space-y-4">
          {courses?.map((course: any) => {
            const courseProgress = progress?.find((p) => p.course_id === course.id)
            const isCompleted = courseProgress?.completed || false

            return (
              <Card key={course.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-xl font-semibold">{course.title}</h3>
                      {course.is_required && <Badge variant="secondary">Required</Badge>}
                      {isCompleted && (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2">{course.description}</p>
                    <p className="text-sm text-muted-foreground">{course.duration_minutes} minutes</p>
                    {courseProgress?.quiz_score && (
                      <p className="text-sm text-muted-foreground mt-2">Quiz Score: {courseProgress.quiz_score}%</p>
                    )}
                  </div>
                  <Link href={`/training/courses/${course.id}`}>
                    <Button variant={isCompleted ? "outline" : "default"}>
                      {isCompleted ? "Review" : "Start Course"}
                    </Button>
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
