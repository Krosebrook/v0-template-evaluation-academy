"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Star } from "lucide-react"
import Link from "next/link"

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    const mockRecommendations = [
      {
        id: "1",
        name: "Modern Dashboard Template",
        description: "A sleek and responsive dashboard with charts and analytics",
        category: "Web Development",
        score: 0.95,
        reason: "matches your favorite category, 3 matching tags, highly rated",
        rating: 4.8,
      },
      {
        id: "2",
        name: "Authentication Flow",
        description: "Complete authentication system with OAuth and email verification",
        category: "Backend",
        score: 0.87,
        reason: "popular template, highly rated",
        rating: 4.7,
      },
    ]
    setRecommendations(mockRecommendations)
  }, [])

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Recommendations
        </h1>
        <p className="text-muted-foreground">Personalized template suggestions based on your interests and activity</p>
      </div>

      <div className="grid gap-6">
        {recommendations.map((rec) => (
          <Card key={rec.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{rec.name}</CardTitle>
                  <CardDescription>{rec.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="ml-4">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {Math.round(rec.score * 100)}% match
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {rec.rating}
                  </span>
                  <span>{rec.category}</span>
                  <span className="text-xs">{rec.reason}</span>
                </div>
                <Button asChild>
                  <Link href={`/templates/${rec.id}`}>View Template</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
