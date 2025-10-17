import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://templategen.academy"

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/browse", "/templates", "/training", "/marketplace", "/leaderboard", "/help"],
        disallow: ["/api", "/admin", "/profile/settings", "/auth"],
      },
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
