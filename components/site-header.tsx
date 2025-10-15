import Link from "next/link"
import { UserNav } from "@/components/user-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Template Academy</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/templates" className="transition-colors hover:text-foreground/80">
              Templates
            </Link>
            <Link href="/knowledge" className="transition-colors hover:text-foreground/80">
              Knowledge
            </Link>
            <Link href="/library" className="transition-colors hover:text-foreground/80">
              Library
            </Link>
            <Link href="/tutorials" className="transition-colors hover:text-foreground/80">
              Tutorials
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <UserNav />
        </div>
      </div>
    </header>
  )
}
