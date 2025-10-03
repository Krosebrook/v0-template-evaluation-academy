import { ResourceCard } from "@/components/resource-card"

const resources = [
  {
    id: 1,
    title: "Complete Guide to Template Evaluation",
    description:
      "Learn the fundamentals of evaluating templates with this comprehensive guide covering all essential criteria.",
    type: "Guide",
    duration: "15 min read",
    category: "guides",
  },
  {
    id: 2,
    title: "Code Quality Assessment Techniques",
    description: "Master the art of analyzing code quality, structure, and maintainability in modern web templates.",
    type: "Guide",
    duration: "12 min read",
    category: "guides",
  },
  {
    id: 3,
    title: "Performance Optimization Checklist",
    description:
      "A practical checklist for evaluating template performance, including Core Web Vitals and optimization strategies.",
    type: "Checklist",
    duration: "8 min read",
    category: "tips",
  },
  {
    id: 4,
    title: "Accessibility Evaluation Workshop",
    description: "Video tutorial on evaluating templates for WCAG compliance and inclusive design principles.",
    type: "Video",
    duration: "45 min",
    category: "videos",
  },
  {
    id: 5,
    title: "Next.js Template Best Practices",
    description:
      "Explore best practices specific to Next.js templates, including App Router patterns and server components.",
    type: "Guide",
    duration: "20 min read",
    category: "guides",
  },
  {
    id: 6,
    title: "Real-World Evaluation Examples",
    description: "Study actual template evaluations with detailed breakdowns and scoring rationale.",
    type: "Case Study",
    duration: "25 min read",
    category: "code",
  },
  {
    id: 7,
    title: "Security Assessment Framework",
    description: "Learn how to identify security vulnerabilities and evaluate templates for production readiness.",
    type: "Guide",
    duration: "18 min read",
    category: "guides",
  },
  {
    id: 8,
    title: "Community Evaluation Standards",
    description: "Understand the community-driven standards and conventions for template evaluation.",
    type: "Article",
    duration: "10 min read",
    category: "community",
  },
  {
    id: 9,
    title: "TypeScript Template Patterns",
    description: "Code examples demonstrating proper TypeScript usage and type safety in templates.",
    type: "Code",
    duration: "30 min",
    category: "code",
  },
]

export function ResourcesGrid() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{resources.length} resources available</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  )
}
