"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { MessageSquare, Reply, Trash2, Edit2, Send } from "lucide-react"
import { useRouter } from "next/navigation"

interface Comment {
  id: string
  template_id: string
  user_id: string
  parent_id: string | null
  content: string
  created_at: string
  updated_at: string
  profiles: {
    display_name: string
    role: string
  }
  replies?: Comment[]
}

interface CommentsSectionProps {
  templateId: string
}

export function CommentsSection({ templateId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const supabase = useMemo(() => createBrowserClient(), [])
  const router = useRouter()

  const checkUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setCurrentUserId(user?.id || null)
  }, [supabase])

  const loadComments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles:user_id (
            display_name,
            role
          )
        `)
        .eq("template_id", templateId)
        .order("created_at", { ascending: true })

      if (error) throw error

      // Organize comments into threads
      const commentMap = new Map<string, Comment>()
      const rootComments: Comment[] = []

      data?.forEach((comment: Comment) => {
        const commentWithReplies = { ...comment, replies: [] }
        commentMap.set(comment.id, commentWithReplies)

        if (!comment.parent_id) {
          rootComments.push(commentWithReplies)
        }
      })

      // Add replies to parent comments
      data?.forEach((comment: Comment) => {
        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id)
          if (parent) {
            parent.replies = parent.replies || []
            parent.replies.push(commentMap.get(comment.id)!)
          }
        }
      })

      setComments(rootComments)
    } catch (error) {
      console.error("Error loading comments:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, templateId])

  useEffect(() => {
    loadComments()
    checkUser()

    // Subscribe to new comments
    const channel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `template_id=eq.${templateId}`,
        },
        () => {
          loadComments()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [templateId, supabase, loadComments, checkUser])
    }
  }

  async function handleSubmitComment() {
    if (!newComment.trim()) return

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase.from("comments").insert({
        template_id: templateId,
        user_id: user.id,
        content: newComment.trim(),
      })

      if (error) throw error

      setNewComment("")
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSubmitReply(parentId: string) {
    if (!replyContent.trim()) return

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase.from("comments").insert({
        template_id: templateId,
        user_id: user.id,
        parent_id: parentId,
        content: replyContent.trim(),
      })

      if (error) throw error

      setReplyingTo(null)
      setReplyContent("")
    } catch (error) {
      console.error("Error submitting reply:", error)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdateComment(commentId: string) {
    if (!editContent.trim()) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from("comments")
        .update({
          content: editContent.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", commentId)

      if (error) throw error

      setEditingId(null)
      setEditContent("")
    } catch (error) {
      console.error("Error updating comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!confirm("Are you sure you want to delete this comment?")) return

    try {
      const { error } = await supabase.from("comments").delete().eq("id", commentId)

      if (error) throw error
    } catch (error) {
      console.error("Error deleting comment:", error)
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return "just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  function renderComment(comment: Comment, isReply = false) {
    const isEditing = editingId === comment.id
    const isOwner = currentUserId === comment.user_id

    return (
      <div key={comment.id} className={`${isReply ? "ml-8 mt-4" : "mt-4"}`}>
        <Card className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="font-medium">{comment.profiles?.display_name || "Anonymous"}</span>
              {comment.profiles?.role === "evaluator" && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Evaluator</span>
              )}
              {comment.profiles?.role === "admin" && (
                <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Admin</span>
              )}
              <span className="ml-2 text-sm text-muted-foreground">{formatDate(comment.created_at)}</span>
              {comment.updated_at !== comment.created_at && (
                <span className="ml-1 text-xs text-muted-foreground">(edited)</span>
              )}
            </div>
            {isOwner && !isEditing && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setEditingId(comment.id)
                    setEditContent(comment.content)
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="min-h-[80px]" />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleUpdateComment(comment.id)} disabled={submitting}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null)
                    setEditContent("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              {!isReply && (
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => setReplyingTo(comment.id)}>
                  <Reply className="h-4 w-4 mr-1" />
                  Reply
                </Button>
              )}
            </>
          )}

          {replyingTo === comment.id && (
            <div className="mt-4 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleSubmitReply(comment.id)} disabled={submitting}>
                  <Send className="h-4 w-4 mr-1" />
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setReplyingTo(null)
                    setReplyContent("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">{comment.replies.map((reply) => renderComment(reply, true))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Discussion ({comments.length})</h3>
      </div>

      {/* New Comment Form */}
      <Card className="p-4">
        <Textarea
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] mb-3"
        />
        <Button onClick={handleSubmitComment} disabled={submitting || !newComment.trim()}>
          <Send className="h-4 w-4 mr-2" />
          Post Comment
        </Button>
      </Card>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No comments yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div>{comments.map((comment) => renderComment(comment))}</div>
      )}
    </div>
  )
}
