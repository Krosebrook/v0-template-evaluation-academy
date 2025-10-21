import { createClient } from "@/lib/supabase/server"
import { TemplateGallery } from "@/components/template-gallery"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"

async function withTimeout<T>(promise: Promise<T>, timeoutMs = 8000): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Query timeout")), timeoutMs),
  )
  return Promise.race([promise, timeoutPromise])
}

export default async function TemplatesPage() {
  try {
    const supabase = await createClient()

    const { data: templates, error } = await withTimeout(
      supabase.from("templates").select("*, evaluations(overall_score)").order("created_at", { ascending: false }),
      10000,
    )

    if (error) {
      console.error("[v0] Error fetching templates:", error)
    }

    const submitterIds = templates
      ? [...new Set(templates.map((t) => t.submitted_by).filter((id): id is string => id !== null))]
      : []

    let profiles: any[] = []
    if (submitterIds.length > 0) {
      try {
        const { data } = await withTimeout(
          supabase.from("profiles").select("id, display_name, avatar_url").in("id", submitterIds),
          5000,
        )
        profiles = data || []
      } catch (error) {
        console.error("[v0] Error fetching profiles:", error)
      }
    }

    const profileMap = new Map(profiles.map((p) => [p.id, p]))

    const templatesWithProfiles = templates?.map((template) => ({
      ...template,
      profiles: profileMap.get(template.submitted_by) || null,
    }))

    const templatesWithScores = templatesWithProfiles?.map((template) => ({
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
  } catch (error) {
    console.error("[v0] Templates page error:", error)
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Unable to load templates</h1>
            <p className="text-muted-foreground mb-6">Please try again later</p>
            <Link href="/">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }
}
