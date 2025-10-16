import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TemplateEmbedPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createServerClient()

  // Track embed view
  await supabase.from("embed_views").insert({
    template_id: params.id,
  })

  // Fetch template with evaluation
  const { data: template } = await supabase
    .from("templates")
    .select(`
      *,
      evaluations (
        code_quality,
        documentation,
        usability,
        performance,
        accessibility,
        innovation
      )
    `)
    .eq("id", params.id)
    .single()

  if (!template) notFound()

  // Calculate average score
  const evaluations = template.evaluations || []
  const avgScore =
    evaluations.length > 0
      ? evaluations.reduce(
          (sum: number, e: any) =>
            sum + (e.code_quality + e.documentation + e.usability + e.performance + e.accessibility + e.innovation) / 6,
          0,
        ) / evaluations.length
      : 0

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{template.title}</h1>
            <p className="text-muted-foreground">{template.description}</p>
          </div>
          <Badge variant="default" className="text-lg px-3 py-1">
            {avgScore.toFixed(1)}/10
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">{template.category}</Badge>
          <Badge variant="outline">{template.difficulty}</Badge>
        </div>

        {template.demo_url && (
          <div className="mb-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <iframe src={template.demo_url} className="w-full h-full" title={template.title} />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {template.demo_url && (
            <Button asChild>
              <a href={template.demo_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Demo
              </a>
            </Button>
          )}
          {template.github_url && (
            <Button variant="outline" asChild>
              <a href={template.github_url} target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
          )}
        </div>

        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <a href="/" className="font-semibold hover:underline">
              Template Evaluation Academy
            </a>
          </p>
        </div>
      </Card>
    </div>
  )
}
