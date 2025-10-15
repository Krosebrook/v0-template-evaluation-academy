import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, GitBranch, ExternalLink } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function TemplateVersionsPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  const { data: template } = await supabase
    .from("templates")
    .select("*, profiles:user_id(display_name)")
    .eq("id", params.id)
    .single()

  if (!template) {
    redirect("/templates")
  }

  const { data: versions } = await supabase
    .from("template_versions")
    .select("*")
    .eq("template_id", params.id)
    .order("version", { ascending: false })

  const { data: allVersions } = await supabase
    .from("templates")
    .select("*")
    .or(`id.eq.${params.id},parent_template_id.eq.${params.id}`)
    .order("version", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href={`/templates/results/${params.id}`}>
            <Button variant="outline">Back to Template</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{template.title}</CardTitle>
                <CardDescription className="mt-2">by {template.profiles?.display_name || "Anonymous"}</CardDescription>
              </div>
              <Badge variant={template.is_latest ? "default" : "secondary"}>
                v{template.version} {template.is_latest && "(Latest)"}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Version History</h2>
          </div>

          {allVersions && allVersions.length > 0 ? (
            allVersions.map((version) => (
              <Card key={version.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">Version {version.version}</CardTitle>
                        {version.is_latest && <Badge>Latest</Badge>}
                        <Badge variant="outline">{version.status}</Badge>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {new Date(version.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </div>
                    <Link href={`/templates/results/${version.id}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-1">Changes</h4>
                      <p className="text-sm text-muted-foreground">
                        {versions?.find((v) => v.version === version.version)?.changelog || "No changelog provided"}
                      </p>
                    </div>

                    {version.title !== template.title && (
                      <div>
                        <h4 className="font-medium mb-1">Title</h4>
                        <p className="text-sm">{version.title}</p>
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {version.tags?.map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-2">
                      {version.github_url && (
                        <a href={version.github_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            GitHub
                          </Button>
                        </a>
                      )}
                      {version.demo_url && (
                        <a href={version.demo_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            Live Demo
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">No version history available</CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
