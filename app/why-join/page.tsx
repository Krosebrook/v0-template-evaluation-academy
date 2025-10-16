import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquare, Heart, Award, TrendingUp, Shield, Sparkles, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function WhyJoinPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Join 10,000+ Template Evaluators
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Why Create an Account?</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Unlock powerful features, earn reputation, and become part of the world's largest template evaluation
              community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg">
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={Star}
            title="Evaluate & Earn"
            description="Provide detailed evaluations and earn reputation points for quality feedback"
            benefits={["Earn reputation points", "Build trust score", "Unlock evaluator badges"]}
          />
          <FeatureCard
            icon={MessageSquare}
            title="Join Discussions"
            description="Engage with template creators and other evaluators in meaningful conversations"
            benefits={["Comment on templates", "Reply to discussions", "Get notifications"]}
          />
          <FeatureCard
            icon={Heart}
            title="Save & Organize"
            description="Create collections, save favorites, and organize templates your way"
            benefits={["Create collections", "Follow creators", "Track favorites"]}
          />
          <FeatureCard
            icon={Award}
            title="Get Certified"
            description="Complete training courses and earn official evaluator certifications"
            benefits={["Bronze to Platinum levels", "Interactive courses", "Official certificates"]}
          />
          <FeatureCard
            icon={TrendingUp}
            title="Track Progress"
            description="View detailed analytics, insights, and personalized recommendations"
            benefits={["Personal dashboard", "Usage analytics", "AI recommendations"]}
          />
          <FeatureCard
            icon={Shield}
            title="Build Reputation"
            description="Establish yourself as a trusted evaluator with reputation scores"
            benefits={["Trust score system", "Leaderboard rankings", "Achievement badges"]}
          />
        </div>
      </section>

      {/* Comparison Table */}
      <section className="border-y bg-muted/20">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Free vs. Registered Account</h2>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Free (No Account)</h3>
                    <ComparisonItem included text="Browse templates" />
                    <ComparisonItem included text="View evaluations" />
                    <ComparisonItem included text="Read comments" />
                    <ComparisonItem included text="See leaderboards" />
                    <ComparisonItem included={false} text="Submit templates" />
                    <ComparisonItem included={false} text="Evaluate templates" />
                    <ComparisonItem included={false} text="Comment & discuss" />
                    <ComparisonItem included={false} text="Vote & react" />
                    <ComparisonItem included={false} text="Create collections" />
                    <ComparisonItem included={false} text="Earn reputation" />
                  </div>
                  <div className="p-6 space-y-4 bg-primary/5">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      Registered Account
                      <Badge>Free</Badge>
                    </h3>
                    <ComparisonItem included text="Browse templates" />
                    <ComparisonItem included text="View evaluations" />
                    <ComparisonItem included text="Read comments" />
                    <ComparisonItem included text="See leaderboards" />
                    <ComparisonItem included text="Submit templates" />
                    <ComparisonItem included text="Evaluate templates" />
                    <ComparisonItem included text="Comment & discuss" />
                    <ComparisonItem included text="Vote & react" />
                    <ComparisonItem included text="Create collections" />
                    <ComparisonItem included text="Earn reputation" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="text-center space-y-4 pb-8">
            <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-lg">
              Join thousands of evaluators and start building your reputation today
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/signup">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/browse">Browse Templates</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  benefits,
}: {
  icon: any
  title: string
  description: string
  benefits: string[]
}) {
  return (
    <Card className="relative overflow-hidden group hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function ComparisonItem({ included, text }: { included: boolean; text: string }) {
  return (
    <div className="flex items-center gap-3">
      {included ? (
        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
      ) : (
        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
      )}
      <span className={included ? "" : "text-muted-foreground"}>{text}</span>
    </div>
  )
}
