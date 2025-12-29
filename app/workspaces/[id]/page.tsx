export const dynamic = "force-dynamic"

import { createServerClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Settings, FileText, Activity, Plus, UserPlus } from "lucide-react"
import Link from "next/link"
import { WorkspaceMembers } from "@/components/workspace-members"
import { WorkspaceTemplates } from "@/components/workspace-templates"
import { WorkspaceActivity } from "@/components/workspace-activity"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function WorkspaceDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch workspace
  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", id)
    .single()

  if (workspaceError || !workspace) {
    notFound()
  }

  // Check if user is a member
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", id)
    .eq("user_id", user.id)
    .single()

  if (!membership) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">You are not a member of this workspace</p>
        </Card>
      </div>
    )
  }

  // Fetch members
  const { data: members } = await supabase
    .from("workspace_members")
    .select(`
      role,
      user_id,
      joined_at,
      profiles:user_id(username, avatar_url, display_name)
    `)
    .eq("workspace_id", id)

  // Fetch workspace templates
  const { data: workspaceTemplates } = await supabase
    .from("workspace_templates")
    .select(`
      *,
      templates(id, title, description, author_id, created_at, status)
    `)
    .eq("workspace_id", id)
    .order("added_at", { ascending: false })

  // Fetch recent activity
  const { data: recentActivity } = await supabase
    .from("workspace_activity")
    .select(`
      *,
      profiles:user_id(username, avatar_url)
    `)
    .eq("workspace_id", id)
    .order("created_at", { ascending: false })
    .limit(20)

  const isOwnerOrAdmin = membership.role === "owner" || membership.role === "admin"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">{workspace.name}</h1>
            <Badge variant={membership.role === "owner" ? "default" : "secondary"}>
              {membership.role}
            </Badge>
          </div>
          {workspace.description && (
            <p className="text-muted-foreground text-lg">{workspace.description}</p>
          )}
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {members?.length || 0} members
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {workspaceTemplates?.length || 0} templates
            </span>
            <span>Created {new Date(workspace.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOwnerOrAdmin && (
            <>
              <Link href={`/workspaces/${id}/invite`}>
                <Button variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Members
                </Button>
              </Link>
              <Link href={`/workspaces/${id}/settings`}>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </>
          )}
          <Link href={`/templates/submit?workspace=${id}`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Template
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <WorkspaceTemplates 
            templates={workspaceTemplates}
            workspaceId={id}
            canManage={isOwnerOrAdmin}
          />
        </TabsContent>

        <TabsContent value="members">
          <WorkspaceMembers 
            members={members}
            workspaceId={id}
            currentUserRole={membership.role}
          />
        </TabsContent>

        <TabsContent value="activity">
          <WorkspaceActivity 
            activities={recentActivity}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
