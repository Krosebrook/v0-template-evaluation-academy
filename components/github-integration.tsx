"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Github, Star, GitFork, AlertCircle, RefreshCw } from "lucide-react"

interface GitHubRepo {
  id: string
  repo_url: string
  repo_owner: string
  repo_name: string
  stars: number
  forks: number
  open_issues: number
  last_sync_at: string | null
}

interface GitHubIntegrationProps {
  templateId: string
  existingRepo?: GitHubRepo | null
}

export function GitHubIntegration({ templateId, existingRepo }: GitHubIntegrationProps) {
  const [repoUrl, setRepoUrl] = useState(existingRepo?.repo_url || "")
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)

  const handleConnect = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/github/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, repoUrl }),
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error("Failed to connect GitHub repo:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      await fetch("/api/github/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      })
      window.location.reload()
    } catch (error) {
      console.error("Failed to sync GitHub repo:", error)
    } finally {
      setSyncing(false)
    }
  }

  if (existingRepo) {
    return (
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Github className="h-6 w-6" />
            <div>
              <h3 className="font-semibold">Connected Repository</h3>
              <a
                href={existingRepo.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {existingRepo.repo_owner}/{existingRepo.repo_name}
              </a>
            </div>
          </div>
          <Button onClick={handleSync} disabled={syncing} size="sm">
            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            Sync
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">{existingRepo.stars} stars</span>
          </div>
          <div className="flex items-center gap-2">
            <GitFork className="h-4 w-4" />
            <span className="text-sm">{existingRepo.forks} forks</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{existingRepo.open_issues} issues</span>
          </div>
        </div>

        {existingRepo.last_sync_at && (
          <p className="text-xs text-muted-foreground mt-4">
            Last synced: {new Date(existingRepo.last_sync_at).toLocaleString()}
          </p>
        )}
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Github className="h-6 w-6" />
        <h3 className="font-semibold">Connect GitHub Repository</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="repo-url">Repository URL</Label>
          <Input
            id="repo-url"
            placeholder="https://github.com/username/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
        </div>

        <Button onClick={handleConnect} disabled={loading || !repoUrl}>
          {loading ? "Connecting..." : "Connect Repository"}
        </Button>
      </div>
    </Card>
  )
}
