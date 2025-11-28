"use client"

import type React from "react"
import type { LucideIcon } from "lucide-react"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Star, MessageSquare, Heart, Award, TrendingUp, Shield, Zap } from "lucide-react"
import Link from "next/link"

interface AuthGateProps {
  feature: string
  children: React.ReactNode
  requireRole?: "evaluator" | "admin"
}

export function AuthGate({ feature, children, requireRole }: AuthGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [hasRole, setHasRole] = useState<boolean | null>(null)
  const supabase = createBrowserClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)

      if (user && requireRole) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

        setHasRole(profile?.role === requireRole || profile?.role === "admin")
      } else {
        setHasRole(true)
      }
    }

    checkAuth()
  }, [requireRole, supabase])

  if (isAuthenticated === null || hasRole === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="border-2">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Sign In Required</CardTitle>
            <CardDescription className="text-base">
              Create a free account to {feature} and unlock all platform features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureBenefit
                icon={Star}
                title="Evaluate Templates"
                description="Provide feedback and earn reputation"
              />
              <FeatureBenefit
                icon={MessageSquare}
                title="Join Discussions"
                description="Comment and engage with community"
              />
              <FeatureBenefit
                icon={Heart}
                title="Save Favorites"
                description="Create collections and follow creators"
              />
              <FeatureBenefit
                icon={Award}
                title="Earn Certifications"
                description="Complete training and get certified"
              />
              <FeatureBenefit icon={TrendingUp} title="Track Progress" description="View analytics and insights" />
              <FeatureBenefit icon={Shield} title="Build Reputation" description="Gain trust scores and badges" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild size="lg" className="flex-1">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="flex-1 bg-transparent">
                <Link href="/signup">Create Account</Link>
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Free forever • No credit card required • Join 10,000+ evaluators
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (requireRole && !hasRole) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="border-2 border-yellow-500/20">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Certification Required</CardTitle>
            <CardDescription className="text-base">
              You need to be a certified {requireRole} to access this feature
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Complete our training program to become a certified evaluator and unlock evaluation privileges.
            </p>
            <Button asChild size="lg" className="w-full">
              <Link href="/training/certification">Start Certification</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

function FeatureBenefit({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
      <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  )
}
