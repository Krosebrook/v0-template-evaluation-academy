"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { triggerHapticFeedback } from "@/lib/pwa/haptics"

interface MobileShareButtonProps {
  title: string
  text: string
  url: string
}

export function MobileShareButton({ title, text, url }: MobileShareButtonProps) {
  const handleShare = async () => {
    triggerHapticFeedback("light")

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      await navigator.clipboard.writeText(url)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  )
}
