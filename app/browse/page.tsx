import { BrowseHeader } from "@/components/browse-header"
import { TemplateFilters } from "@/components/template-filters"
import { TemplateGrid } from "@/components/template-grid"

export default function BrowsePage() {
  return (
    <div className="min-h-screen">
      <BrowseHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-64">
            <TemplateFilters />
          </aside>
          <main className="flex-1">
            <TemplateGrid />
          </main>
        </div>
      </div>
    </div>
  )
}
