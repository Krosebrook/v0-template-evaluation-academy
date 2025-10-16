"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

export function FollowCollectionButton({
  collectionId,
  initialFollowing,
}: {
  collectionId: string
  initialFollowing: boolean
}) {
  const [following, setFollowing] = useState(initialFollowing)
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  const handleToggleFollow = async () => {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      if (following) {
        // Unfollow
        const { error } = await supabase
          .from("collection_followers")
          .delete()
          .eq("collection_id", collectionId)
          .eq("user_id", user.id)

        if (error) throw error
        setFollowing(false)
      } else {
        // Follow
        const { error } = await supabase.from("collection_followers").insert({
          collection_id: collectionId,
          user_id: user.id,
        })

        if (error) throw error
        setFollowing(true)
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant={following ? "secondary" : "default"} onClick={handleToggleFollow} disabled={loading}>
      <Heart className={`mr-2 h-4 w-4 ${following ? "fill-current" : ""}`} />
      {following ? "Following" : "Follow"}
    </Button>
  )
}
