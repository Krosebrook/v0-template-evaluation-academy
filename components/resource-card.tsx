import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Resource {
  id: number
  title: string
  description: string
  type: string
  duration: string
  category: string
}

export function ResourceCard({ resource }: { resource: Resource }) {
  const typeColors: Record<string, string> = {
    Guide: "bg-chart-1/10 text-chart-1 border-chart-1/20",
    Video: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    Checklist: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    "Case Study": "bg-chart-4/10 text-chart-4 border-chart-4/20",
    Article: "bg-chart-5/10 text-chart-5 border-chart-5/20",
    Code: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  }

  return (
    <Card className="group flex flex-col transition-colors hover:border-muted-foreground/50">
      <CardHeader>
        <div className="mb-3 flex items-start justify-between gap-2">
          <Badge variant="outline" className={typeColors[resource.type] || "bg-secondary"}>
            {resource.type}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {resource.duration}
          </div>
        </div>
        <h3 className="text-balance text-lg font-semibold leading-tight">{resource.title}</h3>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
      </CardContent>
      <CardFooter className="border-t border-border pt-4">
        <Button variant="ghost" size="sm" className="ml-auto gap-2" asChild>
          <Link href={`/resources/${resource.id}`}>
            Read More
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
