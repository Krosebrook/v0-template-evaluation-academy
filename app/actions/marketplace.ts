"use server"

import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe/client"
import { revalidatePath } from "next/cache"
import { randomBytes } from "crypto"

export async function createMarketplaceListing(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const templateId = formData.get("templateId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const priceCents = Number.parseInt(formData.get("priceCents") as string)
  const licenseType = formData.get("licenseType") as string

  // Verify user owns the template
  const { data: template } = await supabase
    .from("templates")
    .select("*")
    .eq("id", templateId)
    .eq("author_id", user.id)
    .single()

  if (!template) {
    throw new Error("Template not found or you don't have permission")
  }

  const { data, error } = await supabase
    .from("marketplace_listings")
    .insert({
      template_id: templateId,
      seller_id: user.id,
      title,
      description,
      price_cents: priceCents,
      license_type: licenseType,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/marketplace")
  return data
}

export async function purchaseTemplate(listingId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Get listing details
  const { data: listing } = await supabase
    .from("marketplace_listings")
    .select("*, templates(*)")
    .eq("id", listingId)
    .single()

  if (!listing) {
    throw new Error("Listing not found")
  }

  // Check if already purchased
  const { data: existingPurchase } = await supabase
    .from("template_purchases")
    .select("*")
    .eq("buyer_id", user.id)
    .eq("listing_id", listingId)
    .single()

  if (existingPurchase) {
    throw new Error("You already own this template")
  }

  // Calculate fees (30% platform fee)
  const platformFeeCents = Math.floor(listing.price_cents * 0.3)
  const sellerPayoutCents = listing.price_cents - platformFeeCents

  // Generate license key
  const licenseKey = randomBytes(16).toString("hex")

  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: listing.price_cents,
    currency: "usd",
    metadata: {
      listing_id: listingId,
      buyer_id: user.id,
      seller_id: listing.seller_id,
      template_id: listing.template_id,
    },
  })

  // Record purchase
  const { data: purchase, error } = await supabase
    .from("template_purchases")
    .insert({
      listing_id: listingId,
      buyer_id: user.id,
      seller_id: listing.seller_id,
      price_cents: listing.price_cents,
      platform_fee_cents: platformFeeCents,
      seller_payout_cents: sellerPayoutCents,
      stripe_payment_intent_id: paymentIntent.id,
      license_key: licenseKey,
    })
    .select()
    .single()

  if (error) throw error

  // Create license
  await supabase.from("template_licenses").insert({
    purchase_id: purchase.id,
    license_key: licenseKey,
    buyer_id: user.id,
    template_id: listing.template_id,
    license_type: listing.license_type,
  })

  // Update listing stats
  await supabase
    .from("marketplace_listings")
    .update({
      total_sales: listing.total_sales + 1,
      total_revenue_cents: listing.total_revenue_cents + listing.price_cents,
    })
    .eq("id", listingId)

  revalidatePath("/marketplace")
  return { clientSecret: paymentIntent.client_secret, purchaseId: purchase.id }
}

export async function toggleListingStatus(listingId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data: listing } = await supabase
    .from("marketplace_listings")
    .select("*")
    .eq("id", listingId)
    .eq("seller_id", user.id)
    .single()

  if (!listing) {
    throw new Error("Listing not found")
  }

  await supabase.from("marketplace_listings").update({ is_active: !listing.is_active }).eq("id", listingId)

  revalidatePath("/marketplace/sell")
  return { success: true }
}
