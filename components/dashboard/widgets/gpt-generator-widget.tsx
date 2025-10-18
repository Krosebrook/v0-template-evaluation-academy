"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Sparkles, Download } from "lucide-react"
import Link from "next/link"

export function GPTGeneratorWidget() {
  return (
    <Card className="p-6 glass relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Custom GPT Generator</h2>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Generate fully configured Custom GPT templates with instructions, knowledge base, and actions.
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>AI-powered instruction generation</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Download className="h-3 w-3" />
            <span>Export ready-to-use configurations</span>
          </div>
        </div>

        <Button asChild className="w-full">
          <Link href="/gpt-generator">
            <Bot className="h-4 w-4 mr-2" />
            Generate Custom GPT
          </Link>
        </Button>
      </div>
    </Card>
  )
}
