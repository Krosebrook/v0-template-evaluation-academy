import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Package } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function EarningsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/marketplace/earnings")
  }

  // Get creator's marketplace listings
  const { data: listings } = await supabase
    .from("marketplace_listings")
    .select("*")
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false })

  // Get all purchases of creator's templates
  const { data: purchases } = await supabase
    .from("marketplace_purchases")
    .select(`
      *,
      marketplace_listings (
        title,
        price,
        license_type
      )
    `)
    .in("listing_id", listings?.map((l) => l.id) || [])
    .order("purchased_at", { ascending: false })

  // Calculate total earnings (70% of sales)
  const totalRevenue = purchases?.reduce((sum, p) => sum + (p.marketplace_listings?.price || 0), 0) || 0
  const creatorEarnings = totalRevenue * 0.7
  const platformFee = totalRevenue * 0.3

  // Calculate this month's earnings
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)

  const monthlyPurchases = purchases?.filter((p) => new Date(p.purchased_at) >= thisMonth) || []
  const monthlyRevenue = monthlyPurchases.reduce((sum, p) => sum + (p.marketplace_listings?.price || 0), 0)
  const monthlyEarnings = monthlyRevenue * 0.7

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Creator Earnings</h1>
        <p className="text-muted-foreground">Track your marketplace revenue and sales performance</p>
      </div>

      {/* Earnings Overview */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${creatorEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">70% of ${totalRevenue.toFixed(2)} revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{monthlyPurchases.length} sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchases?.length || 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listings?.filter((l) => l.status === "active").length || 0}</div>
            <p className="text-xs text-muted-foreground">of {listings?.length || 0} total</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>Your latest marketplace transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {purchases && purchases.length > 0 ? (
            <div className="space-y-4">
              {purchases.slice(0, 10).map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{purchase.marketplace_listings?.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(purchase.purchased_at).toLocaleDateString()} •{" "}
                      {purchase.marketplace_listings?.license_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${purchase.marketplace_listings?.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      You earn: ${((purchase.marketplace_listings?.price || 0) * 0.7).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No sales yet</p>
              <Link href="/marketplace/sell">
                <Button>Create Your First Listing</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Listing Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Listing Performance</CardTitle>
          <CardDescription>Sales breakdown by template</CardDescription>
        </CardHeader>
        <CardContent>
          {listings && listings.length > 0 ? (
            <div className="space-y-4">
              {listings.map((listing) => {
                const listingSales = purchases?.filter((p) => p.listing_id === listing.id) || []
                const listingRevenue = listingSales.reduce((sum, p) => sum + listing.price, 0)
                const listingEarnings = listingRevenue * 0.7

                return (
                  <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{listing.title}</p>
                      <p className="text-sm text-muted-foreground">
                        ${listing.price.toFixed(2)} • {listing.license_type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{listingSales.length} sales</p>
                      <p className="text-sm text-muted-foreground">${listingEarnings.toFixed(2)} earned</p>
                    </div>
                    <Badge variant={listing.status === "active" ? "default" : "secondary"} className="ml-4">
                      {listing.status}
                    </Badge>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No listings yet</p>
              <Link href="/marketplace/sell">
                <Button>Create Your First Listing</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
