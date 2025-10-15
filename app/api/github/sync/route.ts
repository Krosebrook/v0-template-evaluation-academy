import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { templateId } = await request.json()

  // Fetch GitHub repo
  const { data: repo } = await supabase.from("github_repos").select("*").eq("template_id", templateId).single()

  if (!repo) {
    return NextResponse.json({ error: "Repository not connected" }, { status: 404 })
  }

  // In production, fetch real data from GitHub API
  // For now, simulate sync with updated stats
  const { error } = await supabase
    .from("github_repos")
    .update({
      stars: repo.stars + Math.floor(Math.random() * 10),
      forks: repo.forks + Math.floor(Math.random() * 5),
      open_issues: Math.max(0, repo.open_issues + Math.floor(Math.random() * 5) - 2),
      last_sync_at: new Date().toISOString(),
    })
    .eq("id", repo.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Simulate adding a new commit
  await supabase.from("github_commits").insert({
    repo_id: repo.id,
    commit_sha: Math.random().toString(36).substring(7),
    commit_message: "Update template",
    author_name: "Developer",
    committed_at: new Date().toISOString(),
  })

  return NextResponse.json({ success: true })
}
