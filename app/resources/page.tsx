import { ResourcesHeader } from "@/components/resources-header"
import { ResourcesGrid } from "@/components/resources-grid"
import { ResourceCategories } from "@/components/resource-categories"

export default function ResourcesPage() {
  return (
    <div className="min-h-screen">
      <ResourcesHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-64">
            <ResourceCategories />
          </aside>
          <main className="flex-1">
            <ResourcesGrid />
          </main>
        </div>
      </div>
    </div>
  )
}
