"use client"

import { useState } from "react"
import { HelpCircle, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface HelpTooltipProps {
  title: string
  content: string
  example?: string
  learnMoreUrl?: string
  position?: "top" | "bottom" | "left" | "right"
}

export function HelpTooltip({ title, content, example, learnMoreUrl, position = "top" }: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-accent transition-colors"
        aria-label={`Help: ${title}`}
      >
        <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <Card
            className={`absolute z-50 w-80 p-4 shadow-lg border-2 border-primary/20 ${positionClasses[position]}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold text-sm">{title}</h4>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
                <X className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{content}</p>
            {example && (
              <div className="bg-muted/50 rounded p-2 mb-3">
                <p className="text-xs font-medium mb-1">Example:</p>
                <p className="text-xs text-muted-foreground">{example}</p>
              </div>
            )}
            {learnMoreUrl && (
              <a
                href={learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Learn more →
              </a>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
