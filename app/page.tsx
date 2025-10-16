import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Star,
  Users,
  Award,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  BarChart3,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 animate-pulse rounded-full bg-white blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-yellow-300 blur-3xl delay-1000" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left column - Content */}
            <div className="flex flex-col justify-center space-y-8">
              <Badge className="w-fit bg-white/20 text-white backdrop-blur-sm hover:bg-white/30">
                <Sparkles className="mr-2 h-4 w-4" />
                Trusted by 10,000+ Developers
              </Badge>

              <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Discover & Evaluate
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  World-Class Templates
                </span>
              </h1>

              <p className="text-pretty text-lg text-white/90 sm:text-xl">
                The premier platform for discovering, evaluating, and sharing production-ready templates. Join our
                community of expert evaluators and template creators.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
                  <Link href="/browse">
                    Browse Templates
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                  asChild
                >
                  <Link href="/why-join">Learn More</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">2,500+</div>
                  <div className="text-sm text-white/80">Templates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">15,000+</div>
                  <div className="text-sm text-white/80">Evaluations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">98%</div>
                  <div className="text-sm text-white/80">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right column - Visual */}
            <div className="relative hidden lg:block">
              <div className="relative h-full">
                {/* Floating cards mockup */}
                <div className="absolute right-0 top-1/2 w-full -translate-y-1/2 space-y-4">
                  <Card className="animate-float ml-auto w-4/5 border-white/20 bg-white/10 p-6 backdrop-blur-lg delay-0">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Premium Template</div>
                        <div className="text-sm text-white/70">Rated 9.8/10</div>
                      </div>
                    </div>
                  </Card>

                  <Card className="animate-float w-4/5 border-white/20 bg-white/10 p-6 backdrop-blur-lg delay-300">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-emerald-500">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Verified Quality</div>
                        <div className="text-sm text-white/70">Expert Evaluated</div>
                      </div>
                    </div>
                  </Card>

                  <Card className="animate-float ml-auto w-4/5 border-white/20 bg-white/10 p-6 backdrop-blur-lg delay-700">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Trending Now</div>
                        <div className="text-sm text-white/70">+2,500 views today</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">Platform Features</Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need to Find the Perfect Template
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-gray-600">
              Our platform combines expert evaluation, community insights, and powerful tools to help you discover
              templates that meet your exact needs.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="group relative overflow-hidden border-2 p-8 transition-all hover:border-purple-500 hover:shadow-xl">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-10 transition-transform group-hover:scale-150" />
              <div className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                  <Star className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Expert Evaluations</h3>
                <p className="text-gray-600">
                  Every template is rigorously evaluated by certified experts across 6 key criteria including code
                  quality, performance, and accessibility.
                </p>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card className="group relative overflow-hidden border-2 p-8 transition-all hover:border-blue-500 hover:shadow-xl">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 opacity-10 transition-transform group-hover:scale-150" />
              <div className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Quality Assurance</h3>
                <p className="text-gray-600">
                  Automated testing suite checks performance, accessibility, security vulnerabilities, and code quality
                  before publication.
                </p>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card className="group relative overflow-hidden border-2 p-8 transition-all hover:border-green-500 hover:shadow-xl">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 opacity-10 transition-transform group-hover:scale-150" />
              <div className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Community Driven</h3>
                <p className="text-gray-600">
                  Join thousands of developers sharing insights, voting on templates, and contributing to a growing
                  knowledge base.
                </p>
              </div>
            </Card>

            {/* Feature 4 */}
            <Card className="group relative overflow-hidden border-2 p-8 transition-all hover:border-orange-500 hover:shadow-xl">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 opacity-10 transition-transform group-hover:scale-150" />
              <div className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
                  <Zap className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Live Preview</h3>
                <p className="text-gray-600">
                  Test templates in real-time with our interactive sandbox. See exactly how they work before committing.
                </p>
              </div>
            </Card>

            {/* Feature 5 */}
            <Card className="group relative overflow-hidden border-2 p-8 transition-all hover:border-yellow-500 hover:shadow-xl">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 opacity-10 transition-transform group-hover:scale-150" />
              <div className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg">
                  <Award className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Certification Program</h3>
                <p className="text-gray-600">
                  Become a certified evaluator through our comprehensive training program with Bronze, Silver, Gold, and
                  Platinum levels.
                </p>
              </div>
            </Card>

            {/* Feature 6 */}
            <Card className="group relative overflow-hidden border-2 p-8 transition-all hover:border-indigo-500 hover:shadow-xl">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 opacity-10 transition-transform group-hover:scale-150" />
              <div className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Advanced Analytics</h3>
                <p className="text-gray-600">
                  Track template performance, user engagement, and quality trends with comprehensive analytics
                  dashboards.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-br from-white to-transparent" />
          <div className="absolute right-0 bottom-0 h-full w-1/2 bg-gradient-to-tl from-white to-transparent" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <Target className="mx-auto mb-6 h-16 w-16 text-white" />
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Find Your Perfect Template?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-white/90">
            Join thousands of developers who trust Template Evaluation Academy for discovering high-quality,
            production-ready templates.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              asChild
            >
              <Link href="/browse">Browse Templates</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
