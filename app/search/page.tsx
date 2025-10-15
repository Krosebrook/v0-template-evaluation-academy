import { Suspense } from "react"
import { AdvancedSearch } from "@/components/advanced-search"

export const dynamic = "force-dynamic"

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Search Templates</h1>
        <p className="text-muted-foreground">Find the perfect template with advanced filters and search</p>
      </div>

      <Suspense fallback={<div>Loading search...</div>}>
        <AdvancedSearch />
      </Suspense>
    </div>
  )
}
