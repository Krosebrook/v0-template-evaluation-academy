import { redirect } from "next/navigation"
import { SubscriptionCheckout } from "@/components/subscription-checkout"
import { SUBSCRIPTION_PLANS } from "@/lib/stripe/products"

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: { plan?: string }
}) {
  const planId = searchParams.plan

  if (!planId) {
    redirect("/pricing")
  }

  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)

  if (!plan || plan.id === "free") {
    redirect("/pricing")
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscribe to {plan.name}</h1>
        <p className="text-muted-foreground">
          ${(plan.priceInCents / 100).toFixed(2)}/month • {plan.creditsPerMonth} credits per month
        </p>
      </div>

      <SubscriptionCheckout planId={planId} />
    </div>
  )
}
