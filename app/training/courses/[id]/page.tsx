export const dynamic = "force-dynamic"

import { createServerClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { CourseContent } from "@/components/course-content"

export default async function CoursePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch course
  const { data: course } = await supabase.from("training_courses").select("*").eq("id", params.id).single()

  if (!course) {
    notFound()
  }

  // Fetch user's progress
  const { data: progress } = await supabase
    .from("user_course_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", params.id)
    .single()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <CourseContent course={course} progress={progress} />
    </div>
  )
}
