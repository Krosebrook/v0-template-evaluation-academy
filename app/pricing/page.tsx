import { Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SUBSCRIPTION_PLANS } from "@/lib/stripe/products"

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground">Start free, upgrade when you need more power</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Card key={plan.id} className={plan.isPopular ? "border-primary shadow-lg" : ""}>
            <CardHeader>
              {plan.isPopular && <Badge className="w-fit mb-2">Most Popular</Badge>}
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${(plan.priceInCents / 100).toFixed(0)}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.id === "free" ? (
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link href={`/checkout?plan=${plan.id}`}>Subscribe</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need More Credits?</h2>
        <p className="text-muted-foreground mb-8">Purchase one-time credit packages to supplement your subscription</p>
        <Button asChild variant="outline" size="lg">
          <Link href="/credits">View Credit Packages</Link>
        </Button>
      </div>
    </div>
  )
}
