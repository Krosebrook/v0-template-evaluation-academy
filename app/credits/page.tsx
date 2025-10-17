import { Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CREDIT_PACKAGES } from "@/lib/stripe/products"

export default function CreditsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Purchase Credits</h1>
        <p className="text-xl text-muted-foreground">One-time credit packages to power your generations</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {CREDIT_PACKAGES.map((pkg) => {
          const totalCredits = pkg.credits + (pkg.bonus || 0)
          const pricePerCredit = pkg.priceInCents / totalCredits

          return (
            <Card key={pkg.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  {pkg.name}
                </CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${(pkg.priceInCents / 100).toFixed(0)}</span>
                  {pkg.bonus && (
                    <Badge variant="secondary" className="ml-2">
                      +{pkg.bonus} bonus
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Credits</span>
                    <span className="font-semibold">{totalCredits}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per Credit</span>
                    <span className="font-semibold">${(pricePerCredit / 100).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/credits/checkout?package=${pkg.id}`}>Purchase</Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
