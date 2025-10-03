import { CheckCircle2, Target, TrendingUp, Award } from "lucide-react"

const features = [
  {
    icon: Target,
    title: "Structured Learning",
    description: "Follow a proven curriculum designed to build your evaluation skills systematically.",
  },
  {
    icon: CheckCircle2,
    title: "Hands-on Practice",
    description: "Evaluate real templates with interactive exercises and instant feedback.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your improvement with detailed analytics and achievement milestones.",
  },
  {
    icon: Award,
    title: "Earn Certificates",
    description: "Showcase your expertise with certificates upon completing evaluation modules.",
  },
]

export function FeaturesSection() {
  return (
    <section className="border-t border-border py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl">Everything you need to master templates</h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Our comprehensive platform provides all the tools and resources for effective learning
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
