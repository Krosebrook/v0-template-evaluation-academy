// Analytics related types

export interface AnalyticsData {
  date: string
  template_id?: string
  views: number
  generations: number
  shares: number
  favorites: number
  avg_rating?: number
  unique_users?: number
}

export interface TemplateAnalytics {
  id: string
  title: string
  name?: string
  created_at: string
  author_id?: string
  status?: string
}

export interface AnalyticsSummary {
  totalViews: number
  totalGenerations: number
  totalEngagement: number
  creditsBalance: number
  templates: TemplateAnalytics[]
  analytics: AnalyticsData[]
  subscription: {
    plan_name: string
    status: string
  } | null
}

export interface ChartData {
  date: string
  views: number
  generations: number
  shares: number
  favorites: number
  engagement: number
}
