import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TestResults } from "@/components/test-results"
import { Button } from "@/components/ui/button"
import { PlayCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TemplateTestsPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch template
  const { data: template } = await supabase.from("templates").select("*").eq("id", params.id).single()

  if (!template) {
    redirect("/browse")
  }

  // Fetch test results
  const { data: tests } = await supabase
    .from("template_tests")
    .select("*")
    .eq("template_id", params.id)
    .order("run_at", { ascending: false })

  // Fetch test summary
  const { data: summary } = await supabase
    .from("template_test_summary")
    .select("*")
    .eq("template_id", params.id)
    .single()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{template.title}</h1>
        <p className="text-muted-foreground">Automated Test Results</p>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold">{summary.total_tests}</div>
            <div className="text-sm text-muted-foreground">Total Tests</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">{summary.passed_tests}</div>
            <div className="text-sm text-muted-foreground">Passed</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold text-red-600">{summary.failed_tests}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold">
              {summary.average_score ? Math.round(summary.average_score) : "N/A"}
            </div>
            <div className="text-sm text-muted-foreground">Avg Score</div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <form action="/api/templates/run-tests" method="POST">
          <input type="hidden" name="templateId" value={params.id} />
          <Button type="submit" size="lg">
            <PlayCircle className="mr-2 h-5 w-5" />
            Run All Tests
          </Button>
        </form>
      </div>

      <TestResults tests={tests || []} />
    </div>
  )
}
