export const dynamic = "force-dynamic"

import { createServerClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Crown, Zap } from "lucide-react"
import Link from "next/link"

export default async function MarketplacePage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch pricing tiers
  const { data: tiers } = await supabase.from("pricing_tiers").select("*").order("price_monthly", { ascending: true })

  // Fetch user's subscription if logged in
  let userSubscription = null
  if (user) {
    const { data } = await supabase
      .from("user_subscriptions")
      .select("*, pricing_tiers(*)")
      .eq("user_id", user.id)
      .single()
    userSubscription = data
  }

  // Fetch premium templates
  const { data: premiumTemplates } = await supabase
    .from("templates")
    .select(`
      *,
      template_pricing(*)
    `)
    .eq("template_pricing.is_premium", true)
    .limit(6)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Template Marketplace</h1>
        <p className="text-xl text-muted-foreground">Access premium templates and unlock advanced features</p>
      </div>

      {/* Pricing Tiers */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {tiers?.map((tier: any) => {
            const isCurrentPlan = userSubscription?.tier_id === tier.id
            const features = tier.features || []

            return (
              <Card
                key={tier.id}
                className={`p-8 ${tier.name === "Pro" ? "border-2 border-primary shadow-lg scale-105" : ""}`}
              >
                {tier.name === "Pro" && (
                  <Badge className="mb-4">
                    <Zap className="mr-1 h-3 w-3" />
                    Most Popular
                  </Badge>
                )}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${tier.price_monthly}</span>
                  <span className="text-muted-foreground">/month</span>
                  {tier.price_yearly > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">or ${tier.price_yearly}/year (save 17%)</p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    Current Plan
                  </Button>
                ) : user ? (
                  <Link href={`/marketplace/subscribe/${tier.id}`}>
                    <Button className="w-full" variant={tier.name === "Pro" ? "default" : "outline"}>
                      {tier.price_monthly === 0 ? "Current Plan" : "Upgrade"}
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button className="w-full" variant={tier.name === "Pro" ? "default" : "outline"}>
                      Sign Up
                    </Button>
                  </Link>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      {/* Premium Templates */}
      {premiumTemplates && premiumTemplates.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">Featured Premium Templates</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {premiumTemplates.map((template: any) => (
              <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{template.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                  </div>
                  <Crown className="h-5 w-5 text-yellow-500" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">${template.template_pricing?.[0]?.price || 0}</span>
                  <Link href={`/templates/${template.id}`}>
                    <Button size="sm">View Details</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
