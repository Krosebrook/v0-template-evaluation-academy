"use server"

import { stripe } from "@/lib/stripe/client"
import { SUBSCRIPTION_PLANS, CREDIT_PACKAGES } from "@/lib/stripe/products"
import { revalidatePath } from "next/cache"
import { getAuthenticatedUser } from "@/lib/auth/server-auth"

export async function startSubscriptionCheckout(planId: string) {
  const { supabase, user, error } = await getAuthenticatedUser()

  if (error || !user) {
    throw new Error(error || "User not authenticated")
  }

  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)
  if (!plan || plan.id === "free") {
    throw new Error(`Invalid plan: ${planId}`)
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: plan.name,
            description: plan.description,
          },
          unit_amount: plan.priceInCents,
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    mode: "subscription",
    metadata: {
      user_id: user.id,
      plan_id: planId,
    },
  })

  return session.client_secret
}

export async function startCreditsCheckout(packageId: string) {
  const { supabase, user, error } = await getAuthenticatedUser()

  if (error || !user) {
    throw new Error(error || "User not authenticated")
  }

  const creditPackage = CREDIT_PACKAGES.find((p) => p.id === packageId)
  if (!creditPackage) {
    throw new Error(`Invalid package: ${packageId}`)
  }

  const totalCredits = creditPackage.credits + (creditPackage.bonus || 0)

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: creditPackage.name,
            description: `${totalCredits} credits${creditPackage.bonus ? ` (includes ${creditPackage.bonus} bonus)` : ""}`,
          },
          unit_amount: creditPackage.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      user_id: user.id,
      package_id: packageId,
      credits: totalCredits,
    },
  })

  return session.client_secret
}

export async function cancelSubscription(subscriptionId: string) {
  const { supabase, user, error } = await getAuthenticatedUser()

  if (error || !user) {
    throw new Error(error || "User not authenticated")
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("id", subscriptionId)
    .eq("user_id", user.id)
    .single()

  if (!subscription) {
    throw new Error("Subscription not found")
  }

  await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    cancel_at_period_end: true,
  })

  await supabase.from("subscriptions").update({ cancel_at_period_end: true }).eq("id", subscriptionId)

  revalidatePath("/billing")
  return { success: true }
}
