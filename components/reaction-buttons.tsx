"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Heart, Lightbulb, CheckCircle, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"

interface ReactionButtonsProps {
  targetId: string
  targetType: "evaluation" | "comment"
  reactions?: Record<string, number>
}

const reactionConfig = {
  evaluation: [
    { type: "helpful", icon: CheckCircle, label: "Helpful", color: "text-blue-600" },
    { type: "insightful", icon: Lightbulb, label: "Insightful", color: "text-yellow-600" },
    { type: "thorough", icon: MessageCircle, label: "Thorough", color: "text-green-600" },
    { type: "constructive", icon: Heart, label: "Constructive", color: "text-pink-600" },
  ],
  comment: [
    { type: "like", icon: Heart, label: "Like", color: "text-pink-600" },
    { type: "love", icon: Heart, label: "Love", color: "text-red-600" },
    { type: "insightful", icon: Lightbulb, label: "Insightful", color: "text-yellow-600" },
    { type: "helpful", icon: CheckCircle, label: "Helpful", color: "text-blue-600" },
  ],
}

export function ReactionButtons({ targetId, targetType, reactions: initialReactions = {} }: ReactionButtonsProps) {
  const { user } = useUser()
  const [reactions, setReactions] = useState<Record<string, number>>(initialReactions)
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const supabase = useMemo(() => createBrowserClient(), [])

  const tableName = targetType === "evaluation" ? "evaluation_reactions" : "comment_reactions"
  const idColumn = targetType === "evaluation" ? "evaluation_id" : "comment_id"

  const loadUserReactions = useCallback(async () => {
    const { data } = await supabase
      .from(tableName)
      .select("reaction_type")
      .eq(idColumn, targetId)
      .eq("user_id", user?.id)

    if (data) {
      setUserReactions(new Set(data.map((r) => r.reaction_type)))
    }
  }, [supabase, tableName, idColumn, targetId, user?.id])

  useEffect(() => {
    if (user) {
      loadUserReactions()
    }
  }, [user, loadUserReactions])

  const handleReaction = async (reactionType: string) => {
    if (!user) return

    setLoading(true)
    const supabase = createBrowserClient()

    try {
      if (userReactions.has(reactionType)) {
        // Remove reaction
        await supabase
          .from(tableName)
          .delete()
          .eq(idColumn, targetId)
          .eq("user_id", user.id)
          .eq("reaction_type", reactionType)

        setReactions((prev) => ({
          ...prev,
          [reactionType]: (prev[reactionType] || 1) - 1,
        }))
        setUserReactions((prev) => {
          const next = new Set(prev)
          next.delete(reactionType)
          return next
        })
      } else {
        // Add reaction
        await supabase.from(tableName).insert({
          [idColumn]: targetId,
          user_id: user.id,
          reaction_type: reactionType,
        })

        setReactions((prev) => ({
          ...prev,
          [reactionType]: (prev[reactionType] || 0) + 1,
        }))
        setUserReactions((prev) => new Set(prev).add(reactionType))
      }
    } catch (error) {
      console.error("Error reacting:", error)
    } finally {
      setLoading(false)
    }
  }

  const config = reactionConfig[targetType]

  return (
    <div className="flex flex-wrap gap-2">
      {config.map(({ type, icon: Icon, label, color }) => {
        const count = reactions[type] || 0
        const isActive = userReactions.has(type)

        return (
          <Button
            key={type}
            variant="outline"
            size="sm"
            onClick={() => handleReaction(type)}
            disabled={loading || !user}
            className={cn("gap-1", isActive && "bg-primary/10 border-primary")}
          >
            <Icon className={cn("h-4 w-4", isActive && color)} />
            <span className="text-xs">{label}</span>
            {count > 0 && <span className="text-xs font-medium">({count})</span>}
          </Button>
        )
      })}
    </div>
  )
}
