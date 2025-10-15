import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Template {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  tags: string[]
  preview_url: string | null
  github_url: string | null
  demo_url: string | null
  profiles: {
    display_name: string | null
    avatar_url: string | null
  } | null
  averageScore: number | null
  evaluationCount: number
}

export function TemplateCard({ template }: { template: Template }) {
  const difficultyColor = {
    Beginner: "bg-green-500/10 text-green-500 border-green-500/20",
    Intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Advanced: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  return (
    <Card className="group flex flex-col transition-all hover:border-primary/50 hover:shadow-lg">
      {/* Preview Image */}
      {template.preview_url && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <Image
            src={template.preview_url || "/placeholder.svg"}
            alt={template.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}

      <CardHeader>
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="text-balance text-xl font-semibold leading-tight">{template.title}</h3>
          <Badge variant="outline" className={difficultyColor[template.difficulty as keyof typeof difficultyColor]}>
            {template.difficulty}
          </Badge>
        </div>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground line-clamp-2">{template.description}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <div className="flex flex-wrap gap-2">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Submitted by */}
        {template.profiles && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>by</span>
            <span className="font-medium">{template.profiles.display_name || "Anonymous"}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-border pt-4">
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            {typeof template.averageScore === "number" && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span>{template.averageScore.toFixed(1)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{template.evaluationCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {template.github_url && (
              <a
                href={template.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {template.demo_url && (
              <a
                href={template.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <Link href={`/templates/evaluate/${template.id}`} className="w-full">
          <Button size="sm" className="w-full">
            Evaluate Template
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
