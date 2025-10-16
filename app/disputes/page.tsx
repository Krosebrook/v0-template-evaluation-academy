export const dynamic = "force-dynamic"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"

export default async function DisputesPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user's disputes
  const { data: disputes } = await supabase
    .from("evaluation_disputes")
    .select(`
      *,
      templates(title),
      evaluations(overall_score),
      profiles:author_id(username)
    `)
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "under_review":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-yellow-500/10 text-yellow-500"
      case "under_review":
        return "bg-blue-500/10 text-blue-500"
      case "resolved":
        return "bg-green-500/10 text-green-500"
      case "rejected":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Disputes</h1>
          <p className="text-muted-foreground">Track and manage your evaluation disputes</p>
        </div>
      </div>

      {disputes && disputes.length > 0 ? (
        <div className="space-y-4">
          {disputes.map((dispute: any) => (
            <Card key={dispute.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(dispute.status)}
                    <h3 className="text-xl font-semibold">{dispute.templates?.title}</h3>
                    <Badge className={getStatusColor(dispute.status)}>{dispute.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{dispute.reason}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Evaluation Score: {dispute.evaluations?.overall_score}/10</span>
                    <span>Submitted: {new Date(dispute.created_at).toLocaleDateString()}</span>
                    {dispute.resolved_at && <span>Resolved: {new Date(dispute.resolved_at).toLocaleDateString()}</span>}
                  </div>
                </div>
                <Link href={`/disputes/${dispute.id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
              </div>

              {dispute.resolution && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-semibold mb-1">Resolution:</p>
                  <p className="text-sm text-muted-foreground">{dispute.resolution}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No disputes yet</h3>
          <p className="text-muted-foreground">You haven't submitted any evaluation disputes</p>
        </Card>
      )}
    </div>
  )
}
