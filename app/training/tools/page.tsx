import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const tools = [
  {
    id: "chain-of-thought",
    title: "Chain-of-Thought Builder",
    description: "Transform basic prompts into step-by-step reasoning prompts that improve AI accuracy by 20-40%",
    category: "Advanced",
    techniques: ["Basic CoT", "Zero-Shot CoT", "Few-Shot CoT", "Tree of Thoughts"],
    icon: "🧩",
    path: "/tools/chain-of-thought-builder.html",
  },
  {
    id: "meta-optimizer",
    title: "Meta-Prompt Optimizer",
    description: "Get 3 AI-optimized versions of your prompt using APE, APO & OPRO techniques",
    category: "Optimization",
    techniques: ["APE", "APO", "OPRO"],
    icon: "🧠",
    path: "/tools/meta-prompt-optimizer.html",
  },
  {
    id: "multi-framework",
    title: "Multi-Framework Generator",
    description: "Generate prompts using 6 proven frameworks: R-I-S-E, R-A-I-N, F-L-O-W, R-O-S-E, P-L-A-N, P-I-V-O",
    category: "Frameworks",
    techniques: ["R-I-S-E", "R-A-I-N", "F-L-O-W", "R-O-S-E", "P-L-A-N", "P-I-V-O"],
    icon: "🎯",
    path: "/tools/multi-framework-generator.html",
  },
  {
    id: "quality-checker",
    title: "Prompt Quality Checker",
    description: "Analyze your prompts and get instant quality scores with improvement suggestions",
    category: "Analysis",
    techniques: ["Clarity", "Specificity", "Context", "Structure"],
    icon: "🔍",
    path: "/tools/prompt-quality-checker.html",
  },
  {
    id: "rise-generator",
    title: "R-I-S-E Framework Generator",
    description: "Focused tool for creating prompts using the R-I-S-E framework (Role, Input, Stops, Expectation)",
    category: "Frameworks",
    techniques: ["R-I-S-E"],
    icon: "📝",
    path: "/tools/rise-framework-generator.html",
  },
  {
    id: "profession-selector",
    title: "Profession Selector",
    description: "Choose from 50+ professional roles to enhance your prompt with expert personas",
    category: "Roles",
    techniques: ["Role Definition", "Persona Creation"],
    icon: "👔",
    path: "/tools/profession-selector.html",
  },
]

const categories = ["All", "Advanced", "Optimization", "Frameworks", "Analysis", "Roles"]

export default function PromptToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Prompt Engineering Tools</h1>
        <p className="text-muted-foreground text-lg">
          Master prompt engineering with our comprehensive toolkit for evaluators
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className="text-4xl">{tool.icon}</div>
                <Badge variant="secondary">{tool.category}</Badge>
              </div>
              <CardTitle className="text-xl">{tool.title}</CardTitle>
              <CardDescription className="text-sm">{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-xs font-semibold text-muted-foreground mb-2">TECHNIQUES</div>
                <div className="flex flex-wrap gap-1">
                  {tool.techniques.map((technique) => (
                    <Badge key={technique} variant="outline" className="text-xs">
                      {technique}
                    </Badge>
                  ))}
                </div>
              </div>
              <Link href={tool.path} target="_blank">
                <Button className="w-full">Launch Tool</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="text-2xl font-bold mb-4">📚 How to Use These Tools</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-1">1. Start with the Quality Checker</h3>
            <p className="text-muted-foreground">
              Analyze your current prompts to understand their strengths and weaknesses
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">2. Choose a Framework</h3>
            <p className="text-muted-foreground">
              Use the Multi-Framework Generator or R-I-S-E Generator to structure your prompts
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">3. Optimize with Meta-Prompt</h3>
            <p className="text-muted-foreground">Get 3 AI-optimized versions using APE, APO, and OPRO techniques</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">4. Add Advanced Reasoning</h3>
            <p className="text-muted-foreground">Use the Chain-of-Thought Builder for complex evaluation tasks</p>
          </div>
        </div>
      </div>
    </div>
  )
}
