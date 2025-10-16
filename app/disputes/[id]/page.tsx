export const dynamic = "force-dynamic"

import { createServerClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DisputeComments } from "@/components/dispute-comments"
import { AlertCircle, CheckCircle, Clock, XCircle, FileText } from "lucide-react"

export default async function DisputeDetailsPage({
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

  // Fetch dispute
  const { data: dispute } = await supabase
    .from("evaluation_disputes")
    .select(`
      *,
      templates(title, description),
      evaluations(overall_score, feedback),
      profiles:author_id(username, avatar_url)
    `)
    .eq("id", params.id)
    .single()

  if (!dispute) {
    notFound()
  }

  // Check if user can view this dispute
  if (dispute.author_id !== user.id) {
    redirect("/disputes")
  }

  // Fetch reviewers
  const { data: reviewers } = await supabase
    .from("dispute_reviewers")
    .select(`
      *,
      profiles:reviewer_id(username, avatar_url)
    `)
    .eq("dispute_id", params.id)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="h-6 w-6 text-yellow-500" />
      case "under_review":
        return <AlertCircle className="h-6 w-6 text-blue-500" />
      case "resolved":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "rejected":
        return <XCircle className="h-6 w-6 text-red-500" />
      default:
        return <Clock className="h-6 w-6" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-8 mb-6">
        <div className="flex items-start gap-4 mb-6">
          {getStatusIcon(dispute.status)}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{dispute.templates?.title}</h1>
            <p className="text-muted-foreground mb-4">{dispute.templates?.description}</p>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{dispute.status.replace("_", " ")}</Badge>
              <span className="text-sm text-muted-foreground">
                Submitted {new Date(dispute.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Dispute Reason</h3>
            <p className="text-muted-foreground">{dispute.reason}</p>
          </div>

          {dispute.evidence_urls && dispute.evidence_urls.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Evidence</h3>
              <div className="space-y-2">
                {dispute.evidence_urls.map((url: string, index: number) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    Evidence {index + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Original Evaluation</h3>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm mb-2">
                <span className="font-semibold">Score:</span> {dispute.evaluations?.overall_score}/10
              </p>
              <p className="text-sm text-muted-foreground">{dispute.evaluations?.feedback}</p>
            </div>
          </div>

          {dispute.resolution && (
            <div>
              <h3 className="font-semibold mb-2">Resolution</h3>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{dispute.resolution}</p>
                {dispute.resolved_at && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Resolved on {new Date(dispute.resolved_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {reviewers && reviewers.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Review Panel</h3>
              <div className="space-y-3">
                {reviewers.map((reviewer: any) => (
                  <div key={reviewer.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {reviewer.profiles?.username?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium">{reviewer.profiles?.username}</span>
                      {reviewer.vote && <Badge variant="secondary">{reviewer.vote}</Badge>}
                    </div>
                    {reviewer.comments && <p className="text-sm text-muted-foreground">{reviewer.comments}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <DisputeComments disputeId={params.id} />
    </div>
  )
}
