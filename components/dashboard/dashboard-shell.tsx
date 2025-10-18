"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface DashboardShellProps {
  children: React.ReactNode
  className?: string
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="gradient-mesh fixed inset-0 -z-10" />
      <div className="container mx-auto px-4 py-6 max-w-[1600px]">{children}</div>
    </div>
  )
}
