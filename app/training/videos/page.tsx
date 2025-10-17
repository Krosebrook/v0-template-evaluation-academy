"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Eye, ThumbsUp } from "lucide-react"

const videos = [
  {
    id: "intro",
    title: "Introduction to Template Generation",
    description: "Learn the fundamentals of creating high-quality templates",
    duration: "12:34",
    views: "1.2K",
    likes: 156,
    category: "Beginner",
    thumbnail: "/template-generation-intro.jpg",
  },
  {
    id: "advanced-prompts",
    title: "Advanced Prompt Engineering Techniques",
    description: "Master complex prompt patterns for better results",
    duration: "18:45",
    views: "856",
    likes: 98,
    category: "Advanced",
    thumbnail: "/advanced-prompts.jpg",
  },
  {
    id: "quality-scoring",
    title: "Understanding Quality Scoring",
    description: "Deep dive into how templates are evaluated and scored",
    duration: "15:20",
    views: "2.1K",
    likes: 234,
    category: "Intermediate",
    thumbnail: "/quality-scoring.jpg",
  },
  {
    id: "best-practices",
    title: "Template Generation Best Practices",
    description: "Tips and tricks from expert generators",
    duration: "22:10",
    views: "3.4K",
    likes: 412,
    category: "Intermediate",
    thumbnail: "/best-practices-concept.png",
  },
]

export default function VideosPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Video Tutorials</h1>
        <p className="text-muted-foreground text-lg">Watch expert generators demonstrate best practices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-video bg-muted">
              <img
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                <Button size="lg" className="rounded-full h-16 w-16">
                  <Play className="h-8 w-8" />
                </Button>
              </div>
              <Badge className="absolute top-2 right-2">{video.duration}</Badge>
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{video.category}</Badge>
              </div>
              <CardTitle className="text-xl">{video.title}</CardTitle>
              <CardDescription>{video.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {video.views} views
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {video.likes}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
