import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download, Key } from "lucide-react"

export default async function MarketplacePurchasesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: purchases } = await supabase
    .from("template_purchases")
    .select("*, marketplace_listings(*, templates(*)), profiles(*)")
    .eq("buyer_id", user.id)
    .order("purchased_at", { ascending: false })

  const totalSpent = purchases?.reduce((sum, p) => sum + p.price_cents, 0) || 0

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Purchases</h1>
        <p className="text-xl text-muted-foreground">Templates you've purchased from the marketplace</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold">${(totalSpent / 100).toFixed(2)}</span>
          <span className="text-muted-foreground ml-2">on {purchases?.length || 0} templates</span>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {purchases?.map((purchase) => (
          <Card key={purchase.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{purchase.marketplace_listings.title}</CardTitle>
                  <CardDescription>
                    Purchased from {purchase.profiles.username} on{" "}
                    {new Date(purchase.purchased_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge>{purchase.marketplace_listings.license_type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <code className="bg-muted px-2 py-1 rounded text-xs">{purchase.license_key}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">Price: ${(purchase.price_cents / 100).toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/templates/${purchase.marketplace_listings.template_id}`}>
                      <Download className="h-4 w-4 mr-2" />
                      View Template
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!purchases || purchases.length === 0) && (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">You haven't purchased any templates yet</p>
          <Button asChild>
            <Link href="/marketplace/browse">Browse Marketplace</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
