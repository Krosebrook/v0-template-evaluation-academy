import { createServerClient } from "@/lib/supabase/server"
import { TemplateComparison } from "@/components/template-comparison"

export default async function CompareTemplatesPage({
  searchParams,
}: {
  searchParams: { ids?: string }
}) {
  const supabase = createServerClient()

  const templateIds = searchParams.ids?.split(",").filter(Boolean) || []

  const { data: templates } = await supabase
    .from("templates")
    .select(`
      *,
      profiles:user_id(display_name)
    `)
    .in("id", templateIds.length > 0 ? templateIds : [""])

  const { data: allTemplates } = await supabase
    .from("templates")
    .select("id, title, category")
    .eq("status", "approved")
    .order("title")

  const evaluationsPromises = (templates || []).map((template) =>
    supabase.from("evaluations").select("*").eq("template_id", template.id),
  )

  const evaluationsResults = await Promise.all(evaluationsPromises)
  const evaluationsMap = (templates || []).reduce(
    (acc, template, index) => {
      acc[template.id] = evaluationsResults[index].data || []
      return acc
    },
    {} as Record<string, any[]>,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Compare Templates</h1>
        <TemplateComparison
          selectedTemplates={templates || []}
          allTemplates={allTemplates || []}
          evaluationsMap={evaluationsMap}
        />
      </div>
    </div>
  )
}
