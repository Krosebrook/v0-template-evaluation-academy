"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createBrowserClient } from "@/lib/supabase/client"
import { MessageSquare } from "lucide-react"

interface DisputeComment {
  id: string
  dispute_id: string
  user_id: string
  comment: string
  created_at: string
  profiles?: {
    username?: string
    avatar_url?: string
  }
}

export function DisputeComments({ disputeId }: { disputeId: string }) {
  const supabase = useMemo(() => createBrowserClient(), [])
  const [comments, setComments] = useState<DisputeComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from("dispute_comments")
      .select(`
        *,
        profiles:user_id(username, avatar_url)
      `)
      .eq("dispute_id", disputeId)
      .order("created_at", { ascending: true })

    if (data) {
      setComments(data as DisputeComment[])
    }
  }, [supabase, disputeId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("dispute_comments").insert({
        dispute_id: disputeId,
        user_id: user.id,
        comment: newComment,
      })

      if (error) throw error

      setNewComment("")
      fetchComments()
    } catch (error) {
      console.error("Error adding comment:", error)
      alert("Failed to add comment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Discussion
      </h3>

      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                {comment.profiles?.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{comment.profiles?.username}</p>
                <p className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{comment.comment}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
        />
        <Button type="submit" disabled={loading || !newComment.trim()}>
          {loading ? "Posting..." : "Post Comment"}
        </Button>
      </form>
    </Card>
  )
}
