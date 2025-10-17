export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  priceInCents: number
  creditsPerMonth: number
  features: string[]
  isPopular?: boolean
}

export interface CreditPackage {
  id: string
  name: string
  description: string
  priceInCents: number
  credits: number
  bonus?: number
}

// Subscription plans - source of truth
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    priceInCents: 0,
    creditsPerMonth: 10,
    features: ["10 generations per month", "Basic templates", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professional creators",
    priceInCents: 1999, // $19.99
    creditsPerMonth: 100,
    features: [
      "100 generations per month",
      "All templates",
      "Priority support",
      "Version history",
      "Team collaboration",
    ],
    isPopular: true,
  },
  {
    id: "team",
    name: "Team",
    description: "For growing teams",
    priceInCents: 4999, // $49.99
    creditsPerMonth: 500,
    features: [
      "500 generations per month",
      "All templates",
      "Priority support",
      "Version history",
      "Team collaboration",
      "Advanced analytics",
      "API access",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    priceInCents: 9999, // $99.99
    creditsPerMonth: 2000,
    features: [
      "2000 generations per month",
      "All templates",
      "Dedicated support",
      "Version history",
      "Team collaboration",
      "Advanced analytics",
      "API access",
      "Custom integrations",
      "SLA guarantee",
    ],
  },
]

// One-time credit packages
export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "credits-10",
    name: "10 Credits",
    description: "Perfect for trying out",
    priceInCents: 499, // $4.99
    credits: 10,
  },
  {
    id: "credits-50",
    name: "50 Credits",
    description: "Great value pack",
    priceInCents: 1999, // $19.99
    credits: 50,
    bonus: 5,
  },
  {
    id: "credits-100",
    name: "100 Credits",
    description: "Most popular",
    priceInCents: 3499, // $34.99
    credits: 100,
    bonus: 15,
  },
  {
    id: "credits-500",
    name: "500 Credits",
    description: "Best value",
    priceInCents: 14999, // $149.99
    credits: 500,
    bonus: 100,
  },
]
