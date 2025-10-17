"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Award, CheckCircle2, Lock } from "lucide-react"
import Link from "next/link"

const courses = [
  {
    id: "beginner",
    title: "Beginner Generator Fundamentals",
    description: "Learn the basics of template generation and prompt engineering",
    duration: "2 hours",
    lessons: 8,
    level: "Beginner",
    progress: 0,
    locked: false,
    topics: ["Introduction to Templates", "Basic Prompt Structure", "Generation Criteria", "Quality Standards"],
  },
  {
    id: "intermediate",
    title: "Intermediate Generation Techniques",
    description: "Master advanced prompt patterns and template optimization",
    duration: "4 hours",
    lessons: 12,
    level: "Intermediate",
    progress: 0,
    locked: true,
    topics: ["Advanced Prompts", "Template Versioning", "Performance Optimization", "User Testing"],
  },
  {
    id: "advanced",
    title: "Advanced Generator Mastery",
    description: "Become an expert in complex template generation and AI integration",
    duration: "6 hours",
    lessons: 15,
    level: "Advanced",
    progress: 0,
    locked: true,
    topics: ["AI-Powered Generation", "Multi-Modal Templates", "Enterprise Patterns", "Best Practices"],
  },
]

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Generation Courses</h1>
        <p className="text-muted-foreground text-lg">Structured learning paths from beginner to expert generator</p>
      </div>

      <div className="grid gap-6">
        {courses.map((course) => (
          <Card key={course.id} className={course.locked ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={
                        course.level === "Beginner"
                          ? "default"
                          : course.level === "Intermediate"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {course.level}
                    </Badge>
                    {course.locked && (
                      <Badge variant="outline" className="gap-1">
                        <Lock className="h-3 w-3" />
                        Locked
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {course.lessons} lessons
                </div>
              </div>

              {course.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium">What you'll learn:</p>
                <ul className="grid grid-cols-2 gap-2">
                  {course.topics.map((topic) => (
                    <li key={topic} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href={`/training/courses/${course.id}`}>
                <Button className="w-full" disabled={course.locked}>
                  {course.locked
                    ? "Complete Previous Course to Unlock"
                    : course.progress > 0
                      ? "Continue Course"
                      : "Start Course"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-purple-500" />
            Earn Your Certification
          </CardTitle>
          <CardDescription>Complete all courses to unlock the certification exam</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/training/certification">
            <Button variant="outline">View Certification Program</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
