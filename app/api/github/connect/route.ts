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

  const { templateId, repoUrl } = await request.json()

  if (!templateId || !repoUrl) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Parse GitHub URL
  const urlMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!urlMatch) {
    return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 })
  }

  const [, owner, name] = urlMatch
  const cleanName = name.replace(/\.git$/, "")

  // Verify template ownership
  const { data: template } = await supabase.from("templates").select("*").eq("id", templateId).single()

  if (!template || template.user_id !== user.id) {
    return NextResponse.json({ error: "Template not found or unauthorized" }, { status: 404 })
  }

  // Fetch GitHub repo data (in production, use GitHub API)
  const repoData = {
    template_id: templateId,
    repo_url: repoUrl,
    repo_owner: owner,
    repo_name: cleanName,
    stars: Math.floor(Math.random() * 1000),
    forks: Math.floor(Math.random() * 100),
    open_issues: Math.floor(Math.random() * 50),
    last_sync_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("github_repos").upsert(repoData, {
    onConflict: "template_id",
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
