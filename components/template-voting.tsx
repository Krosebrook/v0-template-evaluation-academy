"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"

interface TemplateVotingProps {
  templateId: string
  initialUpvotes?: number
  initialDownvotes?: number
}

export function TemplateVoting({ templateId, initialUpvotes = 0, initialDownvotes = 0 }: TemplateVotingProps) {
  const { user } = useUser()
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = useMemo(() => createBrowserClient(), [])

  const loadUserVote = useCallback(async () => {
    const { data } = await supabase
      .from("template_votes")
      .select("vote_type")
      .eq("template_id", templateId)
      .eq("user_id", user?.id)
      .single()

    if (data) {
      setUserVote(data.vote_type as "upvote" | "downvote")
    }
  }, [supabase, templateId, user?.id])

  useEffect(() => {
    if (user) {
      loadUserVote()
    }
  }, [user, loadUserVote])

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!user) return

    setLoading(true)
    const supabase = createBrowserClient()

    try {
      if (userVote === voteType) {
        // Remove vote
        await supabase.from("template_votes").delete().eq("template_id", templateId).eq("user_id", user.id)

        if (voteType === "upvote") {
          setUpvotes((prev) => prev - 1)
        } else {
          setDownvotes((prev) => prev - 1)
        }
        setUserVote(null)
      } else {
        // Add or update vote
        await supabase.from("template_votes").upsert({
          template_id: templateId,
          user_id: user.id,
          vote_type: voteType,
        })

        // Update counts
        if (userVote) {
          // Switching vote
          if (voteType === "upvote") {
            setUpvotes((prev) => prev + 1)
            setDownvotes((prev) => prev - 1)
          } else {
            setDownvotes((prev) => prev + 1)
            setUpvotes((prev) => prev - 1)
          }
        } else {
          // New vote
          if (voteType === "upvote") {
            setUpvotes((prev) => prev + 1)
          } else {
            setDownvotes((prev) => prev + 1)
          }
        }
        setUserVote(voteType)
      }
    } catch (error) {
      console.error("Error voting:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleVote("upvote")}
        disabled={loading || !user}
        className={cn("gap-1", userVote === "upvote" && "bg-green-50 border-green-500 text-green-700")}
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{upvotes}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleVote("downvote")}
        disabled={loading || !user}
        className={cn("gap-1", userVote === "downvote" && "bg-red-50 border-red-500 text-red-700")}
      >
        <ThumbsDown className="h-4 w-4" />
        <span>{downvotes}</span>
      </Button>
    </div>
  )
}
