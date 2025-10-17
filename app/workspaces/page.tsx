import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, FolderOpen } from "lucide-react"
import Link from "next/link"

export default async function WorkspacesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please log in to view workspaces</div>
  }

  // Fetch user's workspaces
  const { data: memberships } = await supabase
    .from("workspace_members")
    .select(
      `
      role,
      workspaces (
        id,
        name,
        description,
        created_at,
        owner_id
      )
    `,
    )
    .eq("user_id", user.id)

  const workspaces = memberships?.map((m: any) => ({
    ...m.workspaces,
    role: m.role,
  }))

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Workspaces</h1>
          <p className="text-muted-foreground">Collaborate with your team on templates</p>
        </div>
        <Link href="/workspaces/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Workspace
          </Button>
        </Link>
      </div>

      {!workspaces || workspaces.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No workspaces yet</h3>
            <p className="text-muted-foreground mb-4">Create your first workspace to start collaborating</p>
            <Link href="/workspaces/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Workspace
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace: any) => (
            <Link key={workspace.id} href={`/workspaces/${workspace.id}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">{workspace.name}</CardTitle>
                    </div>
                    <Badge variant={workspace.role === "owner" ? "default" : "secondary"}>{workspace.role}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {workspace.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(workspace.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
