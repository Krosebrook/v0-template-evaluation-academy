import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ShoppingCart, Star } from "lucide-react"

export default async function MarketplaceBrowsePage() {
  const supabase = await createClient()

  const { data: listings } = await supabase
    .from("marketplace_listings")
    .select("*, templates(*), profiles(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Template Marketplace</h1>
        <p className="text-xl text-muted-foreground">Discover and purchase premium templates from creators</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings?.map((listing) => (
          <Card key={listing.id}>
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge>{listing.license_type}</Badge>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span>{listing.templates.average_score?.toFixed(1) || "N/A"}</span>
                </div>
              </div>
              <CardTitle>{listing.title}</CardTitle>
              <CardDescription className="line-clamp-2">{listing.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Creator</span>
                  <span className="font-medium">{listing.profiles.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sales</span>
                  <span className="font-medium">{listing.total_sales}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold">${(listing.price_cents / 100).toFixed(2)}</span>
              </div>
              <Button asChild>
                <Link href={`/marketplace/purchase/${listing.id}`}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Purchase
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!listings || listings.length === 0) && (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">No templates available yet</p>
          <Button asChild>
            <Link href="/marketplace/sell">Sell Your Templates</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
