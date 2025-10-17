export interface Template {
  id: string
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  author_id: string
  created_at: string
  updated_at: string
  status: "draft" | "published" | "archived"
  views: number
  generations: number
  average_score?: number
}

export interface Generation {
  id: string
  template_id: string
  user_id: string
  overall_score: number
  criteria_scores: Record<string, number>
  feedback: string
  created_at: string
  status: "pending" | "completed" | "disputed"
}

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  bio?: string
  role: "user" | "generator" | "admin"
  reputation_score: number
  generations_count: number
  created_at: string
  onboarding_completed: boolean
}

export interface Workspace {
  id: string
  name: string
  description?: string
  owner_id: string
  created_at: string
  member_count: number
}

export interface WorkspaceMember {
  id: string
  workspace_id: string
  user_id: string
  role: "owner" | "admin" | "member" | "viewer"
  joined_at: string
  profile?: Profile
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  plan: "free" | "starter" | "pro" | "enterprise"
  status: "active" | "canceled" | "past_due"
  current_period_end: string
  created_at: string
}

export interface Credit {
  id: string
  user_id: string
  amount: number
  type: "purchase" | "bonus" | "refund" | "usage"
  description: string
  created_at: string
}

export interface MarketplaceListing {
  id: string
  template_id: string
  seller_id: string
  price: number
  license_type: "personal" | "commercial" | "enterprise"
  status: "active" | "inactive"
  sales_count: number
  created_at: string
}

export interface Purchase {
  id: string
  listing_id: string
  buyer_id: string
  amount: number
  license_key: string
  purchased_at: string
}

export interface TemplateVersion {
  id: string
  template_id: string
  version: string
  content: string
  changelog: string
  author_id: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  read: boolean
  created_at: string
  action_url?: string
}

export interface ImportJob {
  id: string
  user_id: string
  filename: string
  status: "pending" | "processing" | "completed" | "failed"
  total_records: number
  processed_records: number
  errors: string[]
  created_at: string
}

export interface AIRecommendation {
  id: string
  user_id: string
  template_id: string
  score: number
  reason: string
  created_at: string
}

export interface QualityScore {
  template_id: string
  overall_score: number
  completeness: number
  clarity: number
  uniqueness: number
  engagement: number
  feedback: string[]
  calculated_at: string
}
