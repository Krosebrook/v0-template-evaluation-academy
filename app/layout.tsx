import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { Suspense } from "react"
import { MobileNav } from "@/components/mobile-nav"
import { InstallPrompt } from "@/components/install-prompt"
import { PWAInit } from "@/components/pwa-init"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Template Generation Academy",
  description: "Master template generation with AI-powered tools and comprehensive training",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#667eea",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TemplateGen",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <SiteHeader />
          <main className="pb-16 md:pb-0">{children}</main>
          <MobileNav />
          <InstallPrompt />
          <PWAInit />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
