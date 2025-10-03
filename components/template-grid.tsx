import { TemplateCard } from "@/components/template-card"

const allTemplates = [
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
  {
    id: 7,
    title: "Landing Page Pro",
    description: "High-converting landing page template with animations and conversion optimization.",
    difficulty: "Beginner",
    rating: 4.7,
    evaluations: 2341,
    tags: ["Marketing", "Landing", "Animations"],
  },
  {
    id: 8,
    title: "Documentation Site",
    description: "Beautiful documentation template with search, versioning, and dark mode.",
    difficulty: "Intermediate",
    rating: 4.8,
    evaluations: 1876,
    tags: ["Docs", "MDX", "Search"],
  },
  {
    id: 9,
    title: "Social Media App",
    description: "Full-stack social media template with real-time updates and user interactions.",
    difficulty: "Advanced",
    rating: 4.9,
    evaluations: 1432,
    tags: ["Social", "Real-time", "Database"],
  },
]

export function TemplateGrid() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing {allTemplates.length} templates</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {allTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  )
}
