import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle2, Code, FileText, Palette, Zap, Lightbulb, Target } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EvaluationGuidePage() {
  const criteria = [
    {
      name: "Code Quality",
      icon: Code,
      description: "Assess the overall quality, structure, and maintainability of the code",
      guidelines: [
        {
          score: "9-10",
          label: "Excellent",
          description:
            "Clean, well-organized code with consistent naming conventions. Follows best practices and design patterns. Highly maintainable and scalable.",
        },
        {
          score: "7-8",
          label: "Good",
          description:
            "Well-structured code with minor inconsistencies. Generally follows best practices. Easy to understand and maintain.",
        },
        {
          score: "5-6",
          label: "Average",
          description:
            "Functional code with some organizational issues. Some best practices followed. Moderate maintainability.",
        },
        {
          score: "3-4",
          label: "Below Average",
          description:
            "Code works but has significant structural issues. Limited use of best practices. Difficult to maintain.",
        },
        {
          score: "1-2",
          label: "Poor",
          description:
            "Poorly organized code with major issues. Does not follow best practices. Very difficult to maintain or extend.",
        },
      ],
      examples: [
        "Proper component structure and separation of concerns",
        "Consistent naming conventions (camelCase, PascalCase)",
        "Appropriate use of TypeScript types and interfaces",
        "Error handling and edge case management",
        "Code reusability and DRY principles",
      ],
    },
    {
      name: "Documentation",
      icon: FileText,
      description: "Evaluate the quality and completeness of documentation",
      guidelines: [
        {
          score: "9-10",
          label: "Excellent",
          description:
            "Comprehensive documentation including README, setup instructions, API docs, and inline comments. Clear examples and troubleshooting guide.",
        },
        {
          score: "7-8",
          label: "Good",
          description:
            "Good documentation covering most aspects. Clear setup instructions and basic examples. Some inline comments.",
        },
        {
          score: "5-6",
          label: "Average",
          description:
            "Basic documentation present. Setup instructions available but may lack detail. Limited examples.",
        },
        {
          score: "3-4",
          label: "Below Average",
          description: "Minimal documentation. Setup instructions unclear or incomplete. Few or no examples.",
        },
        {
          score: "1-2",
          label: "Poor",
          description: "Little to no documentation. Difficult to understand how to use or set up the template.",
        },
      ],
      examples: [
        "Detailed README with project overview",
        "Clear installation and setup instructions",
        "API documentation and usage examples",
        "Inline code comments for complex logic",
        "Troubleshooting and FAQ section",
      ],
    },
    {
      name: "Design",
      icon: Palette,
      description: "Assess the visual design, UI/UX, and overall aesthetics",
      guidelines: [
        {
          score: "9-10",
          label: "Excellent",
          description:
            "Outstanding visual design with excellent UI/UX. Consistent design system. Highly polished and professional appearance.",
        },
        {
          score: "7-8",
          label: "Good",
          description:
            "Attractive design with good UI/UX. Mostly consistent styling. Professional appearance with minor improvements possible.",
        },
        {
          score: "5-6",
          label: "Average",
          description:
            "Functional design with acceptable UI/UX. Some inconsistencies in styling. Adequate visual appeal.",
        },
        {
          score: "3-4",
          label: "Below Average",
          description: "Basic design with usability issues. Inconsistent styling. Limited visual appeal.",
        },
        {
          score: "1-2",
          label: "Poor",
          description:
            "Poor design with significant usability problems. No consistent styling. Unprofessional appearance.",
        },
      ],
      examples: [
        "Consistent color scheme and typography",
        "Responsive design across devices",
        "Intuitive navigation and user flows",
        "Proper spacing and visual hierarchy",
        "Accessibility considerations (contrast, focus states)",
      ],
    },
    {
      name: "Functionality",
      icon: CheckCircle2,
      description: "Evaluate how well the template works and meets its intended purpose",
      guidelines: [
        {
          score: "9-10",
          label: "Excellent",
          description:
            "All features work flawlessly. Exceeds expectations. Handles edge cases gracefully. No bugs or issues found.",
        },
        {
          score: "7-8",
          label: "Good",
          description:
            "Core features work well. Meets expectations. Minor bugs or edge cases may exist but don't impact usability.",
        },
        {
          score: "5-6",
          label: "Average",
          description:
            "Basic functionality works. Meets minimum requirements. Some bugs or missing features that affect usability.",
        },
        {
          score: "3-4",
          label: "Below Average",
          description: "Limited functionality. Several bugs or missing features. Does not fully meet intended purpose.",
        },
        {
          score: "1-2",
          label: "Poor",
          description: "Major functionality issues. Many bugs. Does not work as intended.",
        },
      ],
      examples: [
        "All advertised features are implemented",
        "Forms validate and submit correctly",
        "Navigation and routing work properly",
        "Data persistence and state management",
        "Error handling and user feedback",
      ],
    },
    {
      name: "Performance",
      icon: Zap,
      description: "Assess the speed, efficiency, and optimization of the template",
      guidelines: [
        {
          score: "9-10",
          label: "Excellent",
          description:
            "Exceptional performance. Highly optimized. Fast load times and smooth interactions. Efficient resource usage.",
        },
        {
          score: "7-8",
          label: "Good",
          description: "Good performance. Well optimized. Reasonable load times. Efficient in most scenarios.",
        },
        {
          score: "5-6",
          label: "Average",
          description:
            "Acceptable performance. Some optimization opportunities. Moderate load times. Works adequately.",
        },
        {
          score: "3-4",
          label: "Below Average",
          description: "Performance issues present. Limited optimization. Slow load times or laggy interactions.",
        },
        {
          score: "1-2",
          label: "Poor",
          description: "Significant performance problems. Not optimized. Very slow or unresponsive.",
        },
      ],
      examples: [
        "Fast initial page load (< 3 seconds)",
        "Optimized images and assets",
        "Efficient database queries",
        "Proper code splitting and lazy loading",
        "Minimal bundle size",
      ],
    },
    {
      name: "Innovation",
      icon: Lightbulb,
      description: "Evaluate creativity, uniqueness, and innovative approaches",
      guidelines: [
        {
          score: "9-10",
          label: "Excellent",
          description:
            "Highly innovative and creative. Unique approach or features. Sets new standards. Inspiring implementation.",
        },
        {
          score: "7-8",
          label: "Good",
          description:
            "Creative and interesting. Some unique features or approaches. Goes beyond basic implementation.",
        },
        {
          score: "5-6",
          label: "Average",
          description:
            "Standard implementation. Follows common patterns. Some creative elements but mostly conventional.",
        },
        {
          score: "3-4",
          label: "Below Average",
          description: "Basic implementation. Limited creativity. Follows templates without much originality.",
        },
        {
          score: "1-2",
          label: "Poor",
          description: "No innovation. Generic implementation. Lacks any creative or unique elements.",
        },
      ],
      examples: [
        "Unique features or functionality",
        "Creative use of technology or libraries",
        "Innovative UI/UX patterns",
        "Novel problem-solving approaches",
        "Cutting-edge techniques or tools",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Evaluation Guidelines</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive rubrics for evaluating templates consistently and fairly
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Evaluation Principles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Be Objective</p>
                <p className="text-sm text-muted-foreground">
                  Base your evaluation on the criteria below, not personal preferences
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Provide Constructive Feedback</p>
                <p className="text-sm text-muted-foreground">
                  Explain your scores with specific examples and suggestions for improvement
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Consider Context</p>
                <p className="text-sm text-muted-foreground">
                  Evaluate templates based on their intended purpose and target audience
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Be Consistent</p>
                <p className="text-sm text-muted-foreground">
                  Apply the same standards across all templates you evaluate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {criteria.map((criterion) => {
            const Icon = criterion.icon
            return (
              <Card key={criterion.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {criterion.name}
                  </CardTitle>
                  <CardDescription>{criterion.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Scoring Guidelines</h4>
                    <div className="space-y-3">
                      {criterion.guidelines.map((guideline) => (
                        <div key={guideline.score} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                          <Badge variant="outline" className="shrink-0 h-fit">
                            {guideline.score}
                          </Badge>
                          <div>
                            <p className="font-medium text-sm mb-1">{guideline.label}</p>
                            <p className="text-sm text-muted-foreground">{guideline.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">What to Look For</h4>
                    <ul className="space-y-2">
                      {criterion.examples.map((example, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Ready to Evaluate?
            </CardTitle>
            <CardDescription>Use these guidelines to provide fair and consistent evaluations</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/templates">
              <Button>Browse Templates to Evaluate</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
