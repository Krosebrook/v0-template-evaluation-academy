import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { moderateContent } from "@/app/actions/moderation"

export default async function ModerationPage() {
  const supabase = await createClient()

  const { data: reports } = await supabase
    .from("reports")
    .select("*, reporter:profiles!reporter_id(username), content:templates(name)")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Content Moderation</h1>

      <div className="space-y-4">
        {reports?.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {report.content_type === "template" ? "Template" : "Comment"} Report
                </CardTitle>
                <Badge variant="destructive">{report.reason}</Badge>
              </div>
              <CardDescription>
                Reported by {report.reporter?.username} on {new Date(report.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Content:</p>
                  <p className="font-medium">{report.content?.name || report.content_id}</p>
                </div>
                {report.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Details:</p>
                    <p>{report.description}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <form action={moderateContent.bind(null, report.id, "approve")}>
                    <Button type="submit" variant="outline" size="sm">
                      Dismiss
                    </Button>
                  </form>
                  <form action={moderateContent.bind(null, report.id, "warn")}>
                    <Button type="submit" variant="secondary" size="sm">
                      Warn User
                    </Button>
                  </form>
                  <form action={moderateContent.bind(null, report.id, "remove")}>
                    <Button type="submit" variant="destructive" size="sm">
                      Remove Content
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {!reports || reports.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">No pending reports</CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
