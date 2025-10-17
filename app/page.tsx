import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Sparkles, Users, Shield, TrendingUp, Award, CheckCircle2, ArrowRight, Star, Layers } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Template Generation Academy - Master AI-Powered Template Creation",
  description:
    "Transform your workflow with AI-powered template generation. Join 10,000+ creators mastering prompt engineering, template design, and AI automation. Start free today.",
  keywords: [
    "template generation",
    "AI templates",
    "prompt engineering",
    "template academy",
    "AI automation",
    "template marketplace",
  ],
  openGraph: {
    title: "Template Generation Academy - Master AI-Powered Template Creation",
    description: "Join 10,000+ creators mastering AI-powered template generation",
    type: "website",
    url: "https://template-academy.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Template Generation Academy",
    description: "Master AI-powered template creation with comprehensive training",
  },
}

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
              <Sparkles className="mr-1 h-3 w-3" />
              Trusted by 10,000+ Creators
            </Badge>
            <h1 className="text-balance text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
              Master AI-Powered Template Generation
            </h1>
            <p className="mt-6 text-pretty text-lg leading-8 text-gray-600">
              Transform your workflow with intelligent template creation. Learn prompt engineering, build reusable
              templates, and join a thriving community of creators.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                <Link href="/auth/sign-up">
                  Start Free Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/generator">Try Generator</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">No credit card required • 100 free generations</p>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">10,000+</div>
              <div className="mt-2 text-sm text-gray-600">Active Creators</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">500K+</div>
              <div className="mt-2 text-sm text-gray-600">Templates Generated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">98%</div>
              <div className="mt-2 text-sm text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to master template generation
            </h2>
            <p className="mt-6 text-pretty text-lg leading-8 text-gray-600">
              Comprehensive tools and training to help you create, manage, and monetize professional templates.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Generation</h3>
              <p className="mt-2 text-sm text-gray-600">
                Advanced AI models with 16 expert personas and 12 prompt layers for precise template creation.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Layers className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Version Control</h3>
              <p className="mt-2 text-sm text-gray-600">
                Track changes, compare versions, and rollback with full template versioning system.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Team Collaboration</h3>
              <p className="mt-2 text-sm text-gray-600">
                Create workspaces, invite team members, and collaborate on templates in real-time.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
              <p className="mt-2 text-sm text-gray-600">
                Track performance, engagement, and revenue with comprehensive analytics and insights.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Quality Scoring</h3>
              <p className="mt-2 text-sm text-gray-600">
                AI-powered quality assessment with actionable feedback to improve your templates.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
                <Award className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Marketplace</h3>
              <p className="mt-2 text-sm text-gray-600">
                Sell your templates with 70% revenue share and multiple licensing options.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Start generating in minutes
            </h2>
            <p className="mt-6 text-pretty text-lg leading-8 text-gray-600">
              Simple three-step process to create professional templates
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                  1
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">Choose Your Approach</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Select from 16 expert personas and 12 prompt layers to match your specific needs.
                </p>
              </div>

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                  2
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">Generate & Refine</h3>
                <p className="mt-2 text-sm text-gray-600">
                  AI creates your template with quality scoring and suggestions for improvement.
                </p>
              </div>

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                  3
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">Share & Monetize</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Publish to the marketplace or share with your team. Earn 70% revenue on sales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by leading creators
            </h2>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                "This platform transformed how I create templates. The AI personas are incredibly accurate and save me
                hours every week."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100" />
                <div>
                  <div className="text-sm font-semibold text-gray-900">Sarah Chen</div>
                  <div className="text-xs text-gray-500">Product Designer</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                "The marketplace feature is a game-changer. I've earned over $5,000 selling my templates in just 3
                months."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100" />
                <div>
                  <div className="text-sm font-semibold text-gray-900">Marcus Rodriguez</div>
                  <div className="text-xs text-gray-500">Content Creator</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                "Team collaboration features are excellent. Our entire design team uses this daily for template
                creation."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100" />
                <div>
                  <div className="text-sm font-semibold text-gray-900">Emily Watson</div>
                  <div className="text-xs text-gray-500">Design Lead</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform your workflow?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-8 text-indigo-100">
            Join thousands of creators who are already mastering AI-powered template generation. Start free today with
            100 generations included.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
              <Link href="/auth/sign-up">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-indigo-700 bg-transparent"
            >
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-x-6 text-sm text-indigo-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
