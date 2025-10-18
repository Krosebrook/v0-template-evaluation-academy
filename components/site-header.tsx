import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { Menu, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 md:mr-8 flex items-center space-x-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-base md:text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Template Academy
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
            {[
              { href: "/generator", label: "Generator" },
              { href: "/templates", label: "Templates" },
              { href: "/marketplace", label: "Marketplace" },
              { href: "/knowledge", label: "Knowledge" },
              { href: "/tutorials", label: "Tutorials" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-md transition-colors hover:text-primary hover:bg-primary/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <NotificationsDropdown />
          <UserNav />

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-card/95 backdrop-blur-xl">
              <nav className="flex flex-col space-y-1 mt-8">
                {[
                  { href: "/generator", label: "Generator" },
                  { href: "/templates", label: "Templates" },
                  { href: "/marketplace", label: "Marketplace" },
                  { href: "/knowledge", label: "Knowledge" },
                  { href: "/library", label: "Library" },
                  { href: "/tutorials", label: "Tutorials" },
                  { href: "/training", label: "Training" },
                  { href: "/collections", label: "Collections" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium px-4 py-3 rounded-lg transition-colors hover:text-primary hover:bg-primary/10"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
