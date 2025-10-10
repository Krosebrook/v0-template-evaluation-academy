"use client"

import { useState } from "react"
import {
  HelpCircle,
  BookOpen,
  Video,
  MessageCircle,
  Search,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Users,
  Layers,
  Zap,
  Code,
  FileText,
  Settings,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

interface HelpArticle {
  id: string
  title: string
  description: string
  category: string
  icon: any
  content: string[]
  relatedArticles?: string[]
}

const HELP_ARTICLES: HelpArticle[] = [
  {
    id: "getting-started",
    title: "Getting Started with Prompt Engineering",
    description: "Learn the basics of creating effective prompts",
    category: "Basics",
    icon: Sparkles,
    content: [
      "Prompt engineering is the art and science of crafting instructions that help AI systems understand and respond to your needs effectively.",
      "Start by clearly defining your goal. What do you want the AI to accomplish? Be specific about the desired outcome.",
      "Use the Prompt Engineering Academy to experiment with different personas, layers, and prompt types to find what works best for your use case.",
      "Remember: the more context you provide, the better the AI can understand and respond to your request.",
    ],
    relatedArticles: ["prompt-types", "personas-guide", "layers-explained"],
  },
  {
    id: "prompt-types",
    title: "Understanding Prompt Types",
    description: "Learn about different prompt engineering approaches",
    category: "Basics",
    icon: Zap,
    content: [
      "Golden Prompts: Comprehensive, production-ready prompts with all best practices built in. Use these for critical tasks that require high-quality, consistent outputs.",
      "Meta Prompts: Prompts that help AI generate better prompts. Perfect for when you're not sure how to structure your request.",
      "Context Engineered: Multi-layered prompts that provide rich context for nuanced responses. Great for complex scenarios requiring deep understanding.",
      "Chain-of-Thought: Step-by-step reasoning prompts for complex problem-solving. The AI shows its work, making it easier to verify logic.",
      "Few-Shot Learning: Provide examples to teach the AI your desired format and style. Excellent for consistent formatting.",
      "Zero-Shot: Direct task specification without examples. Fast and efficient for straightforward requests.",
      "System Instructions: Define AI behavior and capabilities at a fundamental level. Use for setting up AI assistants.",
      "Recursive Refinement: Self-improving prompts through multiple iterations. Best for achieving the highest quality outputs.",
    ],
    relatedArticles: ["getting-started", "when-to-use-what"],
  },
  {
    id: "personas-guide",
    title: "Working with AI Personas",
    description: "How to combine multiple perspectives effectively",
    category: "Advanced",
    icon: Users,
    content: [
      "Personas represent different expertise areas and thinking styles. Combining personas gives you multi-faceted analysis.",
      "Expert Analyst: Deep domain knowledge and analytical thinking. Use for technical accuracy and thorough analysis.",
      "Creative Innovator: Out-of-the-box thinking and novel solutions. Great for brainstorming and innovation.",
      "Patient Educator: Clear explanations with examples. Perfect for learning and teaching scenarios.",
      "Strategic Planner: Long-term thinking and systematic approaches. Ideal for planning and strategy work.",
      "Critical Reviewer: Identifies flaws and improvements. Essential for quality assurance and refinement.",
      "Thorough Researcher: Evidence-based and comprehensive. Use when accuracy and citations are critical.",
      "Technical Engineer: Implementation-focused and practical. Best for building and coding tasks.",
      "Business Consultant: ROI-focused and pragmatic. Perfect for business decisions and strategy.",
      "Pro tip: Combine 2-3 complementary personas for balanced perspectives. Too many can dilute focus.",
    ],
    relatedArticles: ["layers-explained", "advanced-techniques"],
  },
  {
    id: "layers-explained",
    title: "Prompt Layers Deep Dive",
    description: "Understanding the building blocks of great prompts",
    category: "Advanced",
    icon: Layers,
    content: [
      "Layers are the structural components that make up a complete prompt. Each layer serves a specific purpose.",
      "Role Definition (Essential): Establishes who the AI is and what expertise it brings. Always include this.",
      "Context Setting (Essential): Provides background information and constraints. Critical for accurate responses.",
      "Task Specification (Essential): Clearly defines what you want accomplished. The core of your prompt.",
      "Output Format: Specifies how you want the response structured. Ensures consistency and usability.",
      "Examples: Sample inputs and outputs that demonstrate your expectations. Powerful for teaching patterns.",
      "Constraints: Limitations and boundaries for the response. Keeps AI focused and on-track.",
      "Tone & Style: Communication style preferences. Ensures the response matches your needs.",
      "Validation Criteria: Success metrics and quality checks. Helps AI self-evaluate before responding.",
      "Start with essential layers, then add others based on your specific needs. More isn't always better.",
    ],
    relatedArticles: ["prompt-types", "personas-guide"],
  },
  {
    id: "when-to-use-what",
    title: "Choosing the Right Prompt Type",
    description: "Decision guide for selecting prompt approaches",
    category: "Guides",
    icon: HelpCircle,
    content: [
      "Use Golden Prompts when: You need production-ready, comprehensive outputs for critical tasks. Quality and completeness are paramount.",
      "Use Meta Prompts when: You're unsure how to structure your request or want the AI to help design the perfect prompt.",
      "Use Context Engineered when: Your task requires deep understanding of nuanced situations with multiple factors.",
      "Use Chain-of-Thought when: You need to see the reasoning process, verify logic, or solve complex problems step-by-step.",
      "Use Few-Shot when: You have specific examples of what you want and need consistent formatting or style.",
      "Use Zero-Shot when: Your request is straightforward and doesn't require examples or extensive setup.",
      "Use System Instructions when: You're setting up an AI assistant or defining fundamental behavior patterns.",
      "Use Recursive Refinement when: You need the absolute highest quality and are willing to invest in multiple iterations.",
    ],
    relatedArticles: ["prompt-types", "advanced-techniques"],
  },
  {
    id: "advanced-techniques",
    title: "Advanced Prompt Engineering Techniques",
    description: "Pro tips for expert-level prompt crafting",
    category: "Advanced",
    icon: Code,
    content: [
      "Technique 1: Constraint-Based Prompting - Add specific constraints to guide AI behavior and prevent unwanted outputs.",
      "Technique 2: Persona Chaining - Use multiple personas in sequence, each building on the previous one's output.",
      "Technique 3: Negative Prompting - Explicitly state what you DON'T want to avoid common pitfalls.",
      "Technique 4: Temperature Control - Adjust creativity vs. precision based on your task requirements.",
      "Technique 5: Iterative Refinement - Start broad, then progressively narrow focus through follow-up prompts.",
      "Technique 6: Context Injection - Provide relevant background information at the right moment for better understanding.",
      "Technique 7: Output Validation - Include self-checking mechanisms in your prompts for quality assurance.",
      "Technique 8: Format Templates - Create reusable prompt structures for consistent results across similar tasks.",
    ],
    relatedArticles: ["personas-guide", "layers-explained"],
  },
  {
    id: "keyboard-shortcuts",
    title: "Keyboard Shortcuts Reference",
    description: "Speed up your workflow with keyboard commands",
    category: "Tips",
    icon: Settings,
    content: [
      "⌘/Ctrl + Enter: Generate prompt from your current configuration",
      "⌘/Ctrl + S: Save your current configuration for later use",
      "⌘/Ctrl + K: Focus the input field to start typing immediately",
      "⌘/Ctrl + H: Toggle prompt history to view past generations",
      "Escape: Close any open modal or dialog",
      "?: Show keyboard shortcuts help panel",
      "Pro tip: Master these shortcuts to 10x your prompt engineering speed!",
    ],
    relatedArticles: ["getting-started"],
  },
  {
    id: "best-practices",
    title: "Prompt Engineering Best Practices",
    description: "Guidelines for creating effective prompts",
    category: "Guides",
    icon: FileText,
    content: [
      "Be Specific: Vague requests lead to vague responses. Provide clear, detailed instructions.",
      "Provide Context: Help the AI understand the situation, constraints, and desired outcome.",
      "Use Examples: Show, don't just tell. Examples are incredibly powerful for teaching patterns.",
      "Iterate and Refine: Your first prompt rarely perfect. Test, learn, and improve.",
      "Structure Matters: Well-organized prompts with clear sections are easier for AI to parse.",
      "Set Expectations: Define what success looks like and how you'll measure it.",
      "Test Edge Cases: Try your prompt with different inputs to ensure robustness.",
      "Save What Works: Build a library of effective prompts for reuse and reference.",
    ],
    relatedArticles: ["getting-started", "advanced-techniques"],
  },
]

const FAQ_ITEMS = [
  {
    question: "What is prompt engineering?",
    answer:
      "Prompt engineering is the practice of designing and optimizing text inputs (prompts) to get the best possible outputs from AI language models. It combines understanding of AI capabilities with clear communication to achieve specific goals.",
  },
  {
    question: "How do I choose the right personas?",
    answer:
      "Select personas based on the expertise needed for your task. For technical work, use Expert Analyst or Technical Engineer. For creative tasks, add Creative Innovator. For business decisions, include Business Consultant. Combining 2-3 complementary personas often yields the best results.",
  },
  {
    question: "What's the difference between layers?",
    answer:
      "Layers are structural components of prompts. Essential layers (Role, Context, Task) form the foundation. Optional layers (Format, Examples, Constraints, etc.) add specificity and control. Start with essentials, then add others based on your needs.",
  },
  {
    question: "Can I save and reuse my prompts?",
    answer:
      "Yes! Use Cmd/Ctrl+S to save your configuration, or click the Save Config button. Your saved configurations appear in the Saved panel and can be loaded anytime. You can also favorite important configs for quick access.",
  },
  {
    question: "How do I improve a prompt that's not working?",
    answer:
      "Try these steps: 1) Add more context about your goal, 2) Include specific examples of what you want, 3) Try a different prompt type (e.g., Chain-of-Thought for complex reasoning), 4) Add relevant personas for different perspectives, 5) Use the Recursive Refinement type for iterative improvement.",
  },
  {
    question: "What's the best prompt type for beginners?",
    answer:
      "Start with Zero-Shot or Few-Shot prompts. They're straightforward and effective for most tasks. As you gain experience, explore Golden Prompts for comprehensive outputs and Chain-of-Thought for complex problem-solving.",
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const filteredArticles = HELP_ARTICLES.filter(
    (article) =>
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const categories = Array.from(new Set(HELP_ARTICLES.map((a) => a.category)))

  if (selectedArticle) {
    const relatedArticles = HELP_ARTICLES.filter((a) => selectedArticle.relatedArticles?.includes(a.id))

    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
          <Button variant="ghost" onClick={() => setSelectedArticle(null)} className="mb-6">
            ← Back to Help Center
          </Button>

          <article className="space-y-6">
            <header className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <selectedArticle.icon className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="outline">{selectedArticle.category}</Badge>
              </div>
              <h1 className="text-4xl font-bold">{selectedArticle.title}</h1>
              <p className="text-xl text-muted-foreground">{selectedArticle.description}</p>
            </header>

            <Card className="p-8">
              <div className="prose prose-sm max-w-none space-y-4">
                {selectedArticle.content.map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>

            {relatedArticles.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Related Articles</h3>
                <div className="grid gap-3">
                  {relatedArticles.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                    >
                      <article.icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{article.title}</p>
                        <p className="text-xs text-muted-foreground">{article.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </article>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        <header className="text-center space-y-3 mb-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Help Center</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to master prompt engineering
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                ← Back to Generator
              </Button>
            </Link>
          </div>
        </header>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="articles">
              <BookOpen className="w-4 h-4 mr-2" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="faq">
              <MessageCircle className="w-4 h-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Video className="w-4 h-4 mr-2" />
              Videos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            {categories.map((category) => {
              const categoryArticles = filteredArticles.filter((a) => a.category === category)
              if (categoryArticles.length === 0) return null

              return (
                <div key={category}>
                  <h2 className="text-2xl font-bold mb-4">{category}</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryArticles.map((article) => (
                      <Card
                        key={article.id}
                        className="p-6 hover:bg-accent/50 transition-all cursor-pointer group"
                        onClick={() => setSelectedArticle(article)}
                      >
                        <div className="space-y-3">
                          <div className="p-2 bg-primary/10 rounded-lg w-fit">
                            <article.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                          </div>
                          <div className="flex items-center text-sm text-primary">
                            Read more
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}

            {filteredArticles.length === 0 && (
              <Card className="p-12 text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground">Try adjusting your search query</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <div className="max-w-3xl mx-auto space-y-3">
              {FAQ_ITEMS.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-accent/50 transition-colors"
                  >
                    <h3 className="font-semibold pr-4">{item.question}</h3>
                    <ChevronRight
                      className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                        expandedFaq === index ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Introduction to Prompt Engineering",
                  duration: "5:30",
                  description: "Learn the fundamentals of crafting effective prompts",
                },
                {
                  title: "Working with Personas",
                  duration: "8:15",
                  description: "How to combine multiple AI personas for better results",
                },
                {
                  title: "Advanced Prompt Techniques",
                  duration: "12:45",
                  description: "Master chain-of-thought and recursive refinement",
                },
                {
                  title: "Building Golden Prompts",
                  duration: "10:20",
                  description: "Create production-ready prompts with all best practices",
                },
                {
                  title: "Prompt Library Tour",
                  duration: "6:40",
                  description: "Explore pre-built templates and community prompts",
                },
                {
                  title: "Keyboard Shortcuts & Workflow",
                  duration: "4:15",
                  description: "Speed up your prompt engineering with shortcuts",
                },
              ].map((video, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Video className="w-12 h-12 text-primary" />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{video.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {video.duration}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                    <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                      <Video className="w-4 h-4" />
                      Watch Video
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-start gap-4">
            <MessageCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Still need help?</h3>
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for? Our community is here to help you master prompt engineering.
              </p>
              <div className="flex gap-2">
                <Button className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Join Community
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ExternalLink className="w-4 h-4" />
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
