import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Template Evaluation Academy | Discover Premium Web Templates",
  description:
    "The premier platform for discovering, evaluating, and sharing production-ready templates. Join 10,000+ developers and find expertly evaluated templates for your next project.",
  keywords: [
    "web templates",
    "template evaluation",
    "code templates",
    "react templates",
    "nextjs templates",
    "template marketplace",
    "developer tools",
  ],
  authors: [{ name: "Template Evaluation Academy" }],
  creator: "Template Evaluation Academy",
  publisher: "Template Evaluation Academy",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://template-academy.vercel.app",
    title: "Template Evaluation Academy | Discover Premium Web Templates",
    description:
      "Join 10,000+ developers discovering expertly evaluated, production-ready templates. Expert evaluations, quality assurance, and community insights.",
    siteName: "Template Evaluation Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Template Evaluation Academy | Discover Premium Web Templates",
    description:
      "Join 10,000+ developers discovering expertly evaluated, production-ready templates. Expert evaluations, quality assurance, and community insights.",
    creator: "@templateacademy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <SiteHeader />
          {children}
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
