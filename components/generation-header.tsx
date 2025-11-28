import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SocialShare } from "@/components/social-share"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function GenerationHeader(_props: { templateId: string }) {
  return (
    <div className="border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/browse">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Next.js Starter</h1>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Beginner
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate content for this template based on the criteria below
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SocialShare title="Check out my template generation on Template Academy!" />
            <Button>Submit Generation</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
