import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function BillingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*, subscription_plans(*)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  const { data: credits } = await supabase.from("credits").select("*").eq("user_id", user.id).single()

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Billing & Usage</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">{subscription.subscription_plans.name}</span>
                    <Badge>{subscription.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ${(subscription.subscription_plans.price_cents / 100).toFixed(2)}/month
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">
                    {subscription.subscription_plans.credits_per_month} credits per month
                  </p>
                  {subscription.current_period_end && (
                    <p className="text-muted-foreground">
                      Renews on {new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/pricing">Change Plan</Link>
                  </Button>
                  {subscription.cancel_at_period_end ? (
                    <Badge variant="destructive">Cancels at period end</Badge>
                  ) : (
                    <Button variant="ghost" size="sm">
                      Cancel Subscription
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">You're on the Free plan</p>
                <Button asChild>
                  <Link href="/pricing">Upgrade Plan</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credits Balance</CardTitle>
            <CardDescription>Your available credits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="text-4xl font-bold">{credits?.balance || 0}</span>
                <span className="text-muted-foreground ml-2">credits</span>
              </div>
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground">Lifetime earned: {credits?.lifetime_earned || 0}</p>
                <p className="text-muted-foreground">Lifetime spent: {credits?.lifetime_spent || 0}</p>
              </div>
              <Button asChild>
                <Link href="/credits">Purchase Credits</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent payments</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{transaction.description || "Payment"}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(transaction.amount_cents / 100).toFixed(2)}</p>
                    <Badge variant={transaction.status === "succeeded" ? "default" : "secondary"}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No transactions yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
