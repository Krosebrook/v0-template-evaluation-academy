import { TemplateCard } from "@/components/template-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const templates = [
  {
    id: 1,
    title: "Next.js Starter",
    description: "A Next.js App Router template configured with TypeScript and Tailwind CSS.",
    difficulty: "Beginner",
    rating: 4.8,
    evaluations: 1234,
    tags: ["Next.js", "TypeScript", "Tailwind"],
  },
  {
    id: 2,
    title: "E-commerce Platform",
    description: "Full-featured e-commerce template with Stripe integration and admin dashboard.",
    difficulty: "Advanced",
    rating: 4.9,
    evaluations: 856,
    tags: ["Next.js", "Stripe", "Database"],
  },
  {
    id: 3,
    title: "SaaS Starter Kit",
    description: "Complete SaaS boilerplate with authentication, billing, and team management.",
    difficulty: "Intermediate",
    rating: 4.7,
    evaluations: 2103,
    tags: ["Auth", "Payments", "Multi-tenant"],
  },
  {
    id: 4,
    title: "AI Chatbot",
    description: "An open-source AI chatbot template built with the Vercel AI SDK and OpenAI.",
    difficulty: "Intermediate",
    rating: 4.9,
    evaluations: 3421,
    tags: ["AI", "OpenAI", "Streaming"],
  },
  {
    id: 5,
    title: "Portfolio Template",
    description: "Modern portfolio template with MDX blog, project showcase, and contact form.",
    difficulty: "Beginner",
    rating: 4.6,
    evaluations: 987,
    tags: ["MDX", "Blog", "Portfolio"],
  },
  {
    id: 6,
    title: "Admin Dashboard",
    description: "Feature-rich admin dashboard with charts, tables, and data visualization.",
    difficulty: "Intermediate",
    rating: 4.8,
    evaluations: 1567,
    tags: ["Dashboard", "Charts", "Analytics"],
  },
]

export function TemplateGallery() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-balance text-3xl font-bold md:text-4xl">Featured Templates</h2>
            <p className="mt-2 text-pretty text-muted-foreground">
              Practice evaluating real-world templates used by thousands of developers
            </p>
          </div>
          <Button variant="outline" asChild className="hidden md:flex bg-transparent">
            <Link href="/browse">View All</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/browse">View All Templates</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
