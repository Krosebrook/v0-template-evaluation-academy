import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Wrench, Award, Video } from "lucide-react"

const trainingModules = [
  {
    id: "tools",
    title: "Prompt Engineering Tools",
    description: "6 interactive tools for mastering prompt engineering and generation",
    icon: Wrench,
    href: "/training/tools",
    count: "6 tools",
    color: "text-blue-500",
  },
  {
    id: "courses",
    title: "Generation Courses",
    description: "Structured learning paths from beginner to expert generator",
    icon: BookOpen,
    href: "/training/courses",
    count: "12 courses",
    color: "text-green-500",
  },
  {
    id: "certification",
    title: "Certification Program",
    description: "Earn credentials as a certified template generator",
    icon: Award,
    href: "/training/certification",
    count: "3 levels",
    color: "text-purple-500",
  },
  {
    id: "videos",
    title: "Video Tutorials",
    description: "Watch expert generators demonstrate best practices",
    icon: Video,
    href: "/training/videos",
    count: "24 videos",
    color: "text-red-500",
  },
]

export default function TrainingPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Generator Training Academy</h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive training resources to become an expert template generator
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {trainingModules.map((module) => {
          const Icon = module.icon
          return (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`h-8 w-8 ${module.color}`} />
                  <div className="text-sm font-semibold text-muted-foreground">{module.count}</div>
                </div>
                <CardTitle className="text-2xl">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={module.href}>
                  <Button className="w-full">Explore</Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">🎓 Learning Path</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold">Start with Prompt Engineering Tools</h3>
              <p className="text-sm text-muted-foreground">
                Learn the fundamentals of writing effective prompts using our interactive tools
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold">Complete Generation Courses</h3>
              <p className="text-sm text-muted-foreground">
                Take structured courses on template generation criteria and best practices
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold">Practice with Real Templates</h3>
              <p className="text-sm text-muted-foreground">
                Apply your knowledge by generating templates and receiving feedback
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold">Earn Your Certification</h3>
              <p className="text-sm text-muted-foreground">
                Pass the certification exam to become a recognized expert generator
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
