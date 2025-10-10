"use client"

import type React from "react"

import { AlertCircle, CheckCircle, Info, Lightbulb } from "lucide-react"
import { Card } from "@/components/ui/card"

interface InlineHelpProps {
  type: "info" | "tip" | "warning" | "success"
  title?: string
  children: React.ReactNode
  className?: string
}

export function InlineHelp({ type, title, children, className = "" }: InlineHelpProps) {
  const config = {
    info: {
      icon: Info,
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      iconColor: "text-blue-500",
    },
    tip: {
      icon: Lightbulb,
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      iconColor: "text-yellow-500",
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      iconColor: "text-orange-500",
    },
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      iconColor: "text-green-500",
    },
  }

  const { icon: Icon, bgColor, borderColor, iconColor } = config[type]

  return (
    <Card className={`p-4 ${bgColor} border-2 ${borderColor} ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          {title && <h4 className="font-semibold text-sm mb-1">{title}</h4>}
          <div className="text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    </Card>
  )
}
