const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://templategen.academy"

export function generateTemplateStructuredData(template: {
  id: string
  name: string
  description: string
  author: { username: string }
  average_score: number
  created_at: string
  updated_at: string
  category: string
  tags: string[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: template.name,
    description: template.description,
    author: {
      "@type": "Person",
      name: template.author.username,
    },
    datePublished: template.created_at,
    dateModified: template.updated_at,
    programmingLanguage: template.category,
    keywords: template.tags.join(", "),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: template.average_score,
      bestRating: 10,
      worstRating: 0,
    },
  }
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Template Generation Academy",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: "The premier platform for template generation, evaluation, and community collaboration",
    sameAs: [
      "https://twitter.com/templategen",
      "https://github.com/templategen",
      "https://linkedin.com/company/templategen",
    ],
  }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
