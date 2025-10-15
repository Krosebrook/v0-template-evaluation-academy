import { createClient } from "@/lib/supabase/server"
import { TemplateGallery } from "@/components/template-gallery"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function TemplatesPage() {
  const supabase = await createClient()

  // Fetch templates from database
  const { data: templates, error } = await supabase
    .from("templates")
    .select(
      `
      *,
      profiles:submitted_by (
        display_name,
        avatar_url
      ),
      evaluations (
        overall_score
      )
    `,
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching templates:", error)
  }

  // Calculate average scores for each template
  const templatesWithScores = templates?.map((template) => ({
    ...template,
    averageScore:
      template.evaluations && template.evaluations.length > 0
        ? template.evaluations.reduce((sum: number, e: { overall_score: number }) => sum + e.overall_score, 0) /
          template.evaluations.length
        : null,
    evaluationCount: template.evaluations?.length || 0,
  }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Template Gallery
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">Browse and evaluate community-submitted templates</p>
          </div>
          <Link href="/templates/submit">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Submit Template
            </Button>
          </Link>
        </div>

        <TemplateGallery initialTemplates={templatesWithScores || []} />
      </div>
    </main>
  )
}
