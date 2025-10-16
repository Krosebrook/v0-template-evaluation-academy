export const dynamic = "force-dynamic"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Download, CreditCard } from "lucide-react"

export default async function MarketplaceDashboardPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user's subscription
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("*, pricing_tiers(*)")
    .eq("user_id", user.id)
    .single()

  // Fetch user's premium templates
  const { data: premiumTemplates } = await supabase
    .from("templates")
    .select(`
      *,
      template_pricing(*),
      template_purchases(count)
    `)
    .eq("user_id", user.id)
    .eq("template_pricing.is_premium", true)

  // Fetch user's purchases
  const { data: purchases } = await supabase
    .from("template_purchases")
    .select(`
      *,
      templates(title)
    `)
    .eq("user_id", user.id)
    .order("purchased_at", { ascending: false })

  // Fetch user's transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Calculate earnings
  const totalEarnings =
    premiumTemplates?.reduce((sum, template) => {
      const purchases = template.template_purchases?.[0]?.count || 0
      const price = template.template_pricing?.[0]?.price || 0
      const revenueShare = template.template_pricing?.[0]?.revenue_share_percentage || 70
      return sum + purchases * price * (revenueShare / 100)
    }, 0) || 0

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Marketplace Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Premium Templates</p>
              <p className="text-2xl font-bold">{premiumTemplates?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Download className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <p className="text-2xl font-bold">
                {premiumTemplates?.reduce((sum, t) => sum + (t.template_purchases?.[0]?.count || 0), 0) || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <p className="text-2xl font-bold">{subscription?.pricing_tiers?.name || "Free"}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
        {transactions && transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((transaction: any) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${transaction.amount.toFixed(2)}</p>
                  <Badge variant={transaction.status === "completed" ? "secondary" : "outline"}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No transactions yet</p>
        )}
      </Card>

      {/* My Purchases */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">My Purchases</h2>
        {purchases && purchases.length > 0 ? (
          <div className="space-y-3">
            {purchases.map((purchase: any) => (
              <div key={purchase.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{purchase.templates?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(purchase.purchased_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${purchase.amount.toFixed(2)}</p>
                  <Badge variant={purchase.status === "completed" ? "secondary" : "outline"}>{purchase.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No purchases yet</p>
        )}
      </Card>
    </div>
  )
}
