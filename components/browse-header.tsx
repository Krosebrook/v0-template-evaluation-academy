import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function BrowseHeader() {
  return (
    <div className="border-b border-border">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-balance text-4xl font-bold md:text-5xl">Find your Template</h1>
        <p className="mt-3 text-pretty text-lg text-muted-foreground">
          Jumpstart your evaluation practice with templates from our community
        </p>
        <div className="relative mt-8 max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search templates..." className="h-12 pl-10 text-base" />
        </div>
      </div>
    </div>
  )
}
