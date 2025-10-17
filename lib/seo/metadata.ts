import type { Metadata } from "next"

export function generateTemplateMetadata(template: {
  name: string
  description: string
  id: string
  average_score: number
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://templategen.academy"
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(template.name)}&description=${encodeURIComponent(template.description)}&score=${template.average_score}`

  return {
    title: `${template.name} | Template Generation Academy`,
    description: template.description,
    openGraph: {
      title: template.name,
      description: template.description,
      url: `${baseUrl}/templates/${template.id}`,
      siteName: "Template Generation Academy",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: template.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: template.name,
      description: template.description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${baseUrl}/templates/${template.id}`,
    },
  }
}
