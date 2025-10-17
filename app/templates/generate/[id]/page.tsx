import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { GenerationInterface } from "@/components/generation-interface"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function GenerateTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=/templates/generate/${id}`)
  }

  // Fetch template details
  const { data: template, error: templateError } = await supabase
    .from("templates")
    .select(
      `
      *,
      profiles:submitted_by (
        display_name,
        avatar_url
      )
    `,
    )
    .eq("id", id)
    .single()

  if (templateError || !template) {
    notFound()
  }

  // Check if user has already evaluated this template
  const { data: existingEvaluation } = await supabase
    .from("evaluations")
    .select("*")
    .eq("template_id", id)
    .eq("evaluator_id", user.id)
    .single()

  // Get user profile to check role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <Link href="/templates">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Button>
        </Link>

        <GenerationInterface
          template={template}
          userId={user.id}
          userRole={profile?.role || "user"}
          existingEvaluation={existingEvaluation}
        />
      </div>
    </main>
  )
}
