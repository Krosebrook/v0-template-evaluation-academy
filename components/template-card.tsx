import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SocialShare } from "@/components/social-share"
import { Star, Users } from "lucide-react"
import Link from "next/link"

interface Template {
  id: number
  title: string
  description: string
  difficulty: string
  rating: number
  evaluations: number
  tags: string[]
}

export function TemplateCard({ template }: { template: Template }) {
  const difficultyColor = {
    Beginner: "bg-success/10 text-success border-success/20",
    Intermediate: "bg-warning/10 text-warning border-warning/20",
    Advanced: "bg-destructive/10 text-destructive border-destructive/20",
  }

  return (
    <Card className="group flex flex-col transition-colors hover:border-muted-foreground/50">
      <CardHeader>
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="text-balance text-xl font-semibold leading-tight">{template.title}</h3>
          <Badge variant="outline" className={difficultyColor[template.difficulty as keyof typeof difficultyColor]}>
            {template.difficulty}
          </Badge>
        </div>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{template.description}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2">
          {template.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-warning" />
            <span>{template.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{template.evaluations.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SocialShare title={`Check out ${template.title} on Template Academy`} />
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/evaluate/${template.id}`}>Evaluate</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
