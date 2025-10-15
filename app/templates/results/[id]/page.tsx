import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ResultsDashboard } from "@/components/results-dashboard"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function TemplateResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch template with all evaluations
  const { data: template, error: templateError } = await supabase
    .from("templates")
    .select(
      `
      *,
      profiles:submitted_by (
        display_name,
        avatar_url
      ),
      evaluations (
        *,
        profiles:evaluator_id (
          display_name,
          avatar_url
        )
      )
    `,
    )
    .eq("id", id)
    .single()

  if (templateError || !template) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <Link href="/templates">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Button>
        </Link>

        <ResultsDashboard template={template} />
      </div>
    </main>
  )
}
