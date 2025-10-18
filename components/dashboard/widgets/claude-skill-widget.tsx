"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Package, Download } from "lucide-react"
import Link from "next/link"

export function ClaudeSkillWidget() {
  return (
    <Card className="p-6 glass relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Claude Skill Generator</h2>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Create fully populated skill zips for Claude with custom instructions, examples, and configurations.
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>Complete skill package generation</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Download className="h-3 w-3" />
            <span>Download ready-to-import .zip files</span>
          </div>
        </div>

        <Button asChild className="w-full">
          <Link href="/claude-skill-generator">
            <Zap className="h-4 w-4 mr-2" />
            Generate Claude Skill
          </Link>
        </Button>
      </div>
    </Card>
  )
}
