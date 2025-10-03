import { EvaluationHeader } from "@/components/evaluation-header"
import { EvaluationCriteria } from "@/components/evaluation-criteria"
import { TemplatePreview } from "@/components/template-preview"

export default function EvaluatePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen">
      <EvaluationHeader templateId={params.id} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <TemplatePreview />
          <EvaluationCriteria />
        </div>
      </div>
    </div>
  )
}
