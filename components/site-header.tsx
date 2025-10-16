import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-4 md:mr-6 flex items-center space-x-2">
            <span className="font-bold text-sm md:text-base">Template Academy</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
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
          <NotificationsDropdown />
          <UserNav />
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link href="/templates" className="text-lg font-medium transition-colors hover:text-foreground/80">
                  Templates
                </Link>
                <Link href="/knowledge" className="text-lg font-medium transition-colors hover:text-foreground/80">
                  Knowledge
                </Link>
                <Link href="/library" className="text-lg font-medium transition-colors hover:text-foreground/80">
                  Library
                </Link>
                <Link href="/tutorials" className="text-lg font-medium transition-colors hover:text-foreground/80">
                  Tutorials
                </Link>
                <Link href="/training" className="text-lg font-medium transition-colors hover:text-foreground/80">
                  Training
                </Link>
                <Link href="/collections" className="text-lg font-medium transition-colors hover:text-foreground/80">
                  Collections
                </Link>
                <Link href="/marketplace" className="text-lg font-medium transition-colors hover:text-foreground/80">
                  Marketplace
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
