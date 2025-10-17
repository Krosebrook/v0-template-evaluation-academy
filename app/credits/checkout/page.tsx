import { redirect } from "next/navigation"
import { CreditsCheckout } from "@/components/credits-checkout"
import { CREDIT_PACKAGES } from "@/lib/stripe/products"

export default function CreditsCheckoutPage({
  searchParams,
}: {
  searchParams: { package?: string }
}) {
  const packageId = searchParams.package

  if (!packageId) {
    redirect("/credits")
  }

  const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId)

  if (!pkg) {
    redirect("/credits")
  }

  const totalCredits = pkg.credits + (pkg.bonus || 0)

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Purchase {pkg.name}</h1>
        <p className="text-muted-foreground">
          ${(pkg.priceInCents / 100).toFixed(2)} • {totalCredits} credits
          {pkg.bonus && ` (includes ${pkg.bonus} bonus credits)`}
        </p>
      </div>

      <CreditsCheckout packageId={packageId} />
    </div>
  )
}
