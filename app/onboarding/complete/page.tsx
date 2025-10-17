"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Sparkles, TrendingUp, Users } from "lucide-react"
import confetti from "canvas-confetti"

export default function OnboardingCompletePage() {
  const router = useRouter()

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }, [])

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">You're all set!</CardTitle>
            <CardDescription>Welcome to the Template Generation Academy community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Sparkles className="mx-auto h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Generate Templates</h3>
                  <p className="text-sm text-muted-foreground">Create and share your templates</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="mx-auto h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Earn Reputation</h3>
                  <p className="text-sm text-muted-foreground">Build your profile and credibility</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="mx-auto h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Join Community</h3>
                  <p className="text-sm text-muted-foreground">Connect with other creators</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push("/browse")} size="lg" className="w-full">
                Start Exploring Templates
              </Button>
              <Button onClick={() => router.push("/templates/submit")} variant="outline" size="lg" className="w-full">
                Submit Your First Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
