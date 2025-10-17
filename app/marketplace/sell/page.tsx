import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function MarketplaceSellPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: listings } = await supabase
    .from("marketplace_listings")
    .select("*, templates(*)")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false })

  const { data: purchases } = await supabase.from("template_purchases").select("*").eq("seller_id", user.id)

  const totalRevenue = purchases?.reduce((sum, p) => sum + p.seller_payout_cents, 0) || 0
  const totalSales = purchases?.length || 0

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Sell Templates</h1>
          <p className="text-xl text-muted-foreground">Monetize your templates and earn 70% revenue share</p>
        </div>
        <Button asChild>
          <Link href="/marketplace/sell/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Listing
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">${(totalRevenue / 100).toFixed(2)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{totalSales}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{listings?.filter((l) => l.is_active).length || 0}</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Listings</CardTitle>
          <CardDescription>Manage your marketplace listings</CardDescription>
        </CardHeader>
        <CardContent>
          {listings && listings.length > 0 ? (
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{listing.title}</h3>
                      <Badge variant={listing.is_active ? "default" : "secondary"}>
                        {listing.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{listing.license_type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ${(listing.price_cents / 100).toFixed(2)} • {listing.total_sales} sales • $
                      {(listing.total_revenue_cents / 100).toFixed(2)} revenue
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/marketplace/sell/edit/${listing.id}`}>Edit</Link>
                    </Button>
                    <Button variant="ghost" size="sm">
                      {listing.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No listings yet. Create your first listing to start selling!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
