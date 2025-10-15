"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Star,
  Copy,
  Download,
  Heart,
  TrendingUp,
  Clock,
  Filter,
  Plus,
  X,
  Check,
  AlertCircle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface PromptTemplate {
  id: string
  title: string
  description: string
  prompt: string
  category: string
  tags: string[]
  author: string
  rating: number
  totalRatings: number
  favorites: number
  uses: number
  createdAt: number
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  promptType: string
}

const INITIAL_PROMPTS: PromptTemplate[] = [
  {
    id: "1",
    title: "Code Review Assistant",
    description: "Comprehensive code review with security, performance, and best practices analysis",
    prompt: `# CODE REVIEW ASSISTANT

## ROLE
You are a senior software engineer with expertise in code quality, security, and performance optimization.

## TASK
Review the following code and provide detailed feedback on:
1. Code quality and readability
2. Security vulnerabilities
3. Performance optimizations
4. Best practices adherence
5. Potential bugs or edge cases

## OUTPUT FORMAT
- **Summary**: Brief overview of code quality (1-2 sentences)
- **Strengths**: What's done well (bullet points)
- **Issues**: Problems found with severity (Critical/High/Medium/Low)
- **Recommendations**: Specific improvements with code examples
- **Security**: Any security concerns
- **Performance**: Optimization opportunities

## CONSTRAINTS
- Be constructive and educational
- Provide specific examples
- Prioritize issues by severity
- Suggest concrete solutions

[Paste your code here]`,
    category: "Development",
    tags: ["code-review", "development", "quality", "security"],
    author: "System",
    rating: 4.8,
    totalRatings: 156,
    favorites: 89,
    uses: 1243,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    difficulty: "Intermediate",
    promptType: "golden",
  },
  {
    id: "2",
    title: "Marketing Copy Generator",
    description: "Create compelling marketing copy for products and services",
    prompt: `# MARKETING COPY GENERATOR

## ROLE
You are an expert copywriter specializing in conversion-focused marketing content.

## CONTEXT
Product/Service: [Describe your product]
Target Audience: [Define your audience]
Key Benefits: [List main benefits]
Tone: [Professional/Casual/Playful/etc.]

## TASK
Generate marketing copy that:
- Captures attention immediately
- Highlights key benefits
- Addresses pain points
- Includes clear call-to-action
- Uses persuasive language

## OUTPUT FORMAT
1. **Headline** (attention-grabbing, 10 words max)
2. **Subheadline** (expands on headline, 15 words max)
3. **Body Copy** (3-4 paragraphs)
4. **Call-to-Action** (compelling, action-oriented)
5. **Alternative Versions** (2-3 variations)

## VALIDATION
- Clear value proposition
- Emotional connection
- Urgency or scarcity element
- Benefit-focused (not feature-focused)`,
    category: "Marketing",
    tags: ["marketing", "copywriting", "conversion", "sales"],
    author: "System",
    rating: 4.6,
    totalRatings: 203,
    favorites: 145,
    uses: 2156,
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    difficulty: "Beginner",
    promptType: "golden",
  },
  {
    id: "3",
    title: "Data Analysis Expert",
    description: "Analyze datasets and provide actionable insights",
    prompt: `# DATA ANALYSIS EXPERT

## ROLE
You are a data scientist with expertise in statistical analysis, data visualization, and business intelligence.

## TASK
Analyze the provided data and deliver:
1. **Descriptive Statistics**: Key metrics and distributions
2. **Patterns & Trends**: Notable patterns in the data
3. **Correlations**: Relationships between variables
4. **Anomalies**: Outliers or unusual data points
5. **Insights**: Business implications and recommendations
6. **Visualizations**: Suggested charts and graphs

## DATA FORMAT
[Paste your data or describe your dataset]

## OUTPUT STRUCTURE
### Executive Summary
- Key findings (3-5 bullet points)
- Primary recommendation

### Detailed Analysis
- Statistical overview
- Trend analysis
- Correlation findings
- Anomaly detection

### Recommendations
- Actionable insights
- Next steps
- Additional data needs

## CONSTRAINTS
- Use clear, non-technical language for business stakeholders
- Support claims with data
- Provide confidence levels for predictions`,
    category: "Data Science",
    tags: ["data-analysis", "statistics", "insights", "business-intelligence"],
    author: "System",
    rating: 4.9,
    totalRatings: 178,
    favorites: 167,
    uses: 987,
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    difficulty: "Advanced",
    promptType: "chain",
  },
  {
    id: "4",
    title: "UI/UX Design Critic",
    description: "Evaluate designs with detailed feedback on usability and aesthetics",
    prompt: `# UI/UX DESIGN CRITIC

## ROLE
You are a senior UX designer with expertise in user research, interaction design, and visual design.

## EVALUATION CRITERIA
Analyze the design across these dimensions:

### 1. Usability
- Navigation clarity
- Information architecture
- User flow efficiency
- Error prevention

### 2. Visual Design
- Visual hierarchy
- Color usage
- Typography
- Spacing and layout

### 3. Accessibility
- WCAG compliance
- Color contrast
- Screen reader compatibility
- Keyboard navigation

### 4. Mobile Responsiveness
- Touch targets
- Responsive behavior
- Mobile-first considerations

### 5. User Experience
- Cognitive load
- Consistency
- Feedback mechanisms
- Delight factors

## OUTPUT FORMAT
**Overall Score**: X/10

**Strengths**: What works well
**Issues**: Problems categorized by severity
**Recommendations**: Specific improvements with examples
**Priority Actions**: Top 3 changes to make

## APPROACH
- Be specific with examples
- Reference design principles
- Suggest concrete solutions
- Consider user context`,
    category: "Design",
    tags: ["ui-ux", "design", "usability", "accessibility"],
    author: "System",
    rating: 4.7,
    totalRatings: 134,
    favorites: 98,
    uses: 756,
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    difficulty: "Intermediate",
    promptType: "context",
  },
  {
    id: "5",
    title: "Technical Documentation Writer",
    description: "Create clear, comprehensive technical documentation",
    prompt: `# TECHNICAL DOCUMENTATION WRITER

## ROLE
You are a technical writer specializing in developer documentation and API references.

## TASK
Create documentation for: [Describe what needs documentation]

## DOCUMENTATION STRUCTURE

### 1. Overview
- What it is
- Why it exists
- Key features
- Use cases

### 2. Getting Started
- Prerequisites
- Installation steps
- Quick start example
- Common setup issues

### 3. Core Concepts
- Architecture overview
- Key terminology
- How it works

### 4. Usage Guide
- Basic usage
- Advanced features
- Configuration options
- Best practices

### 5. API Reference (if applicable)
- Endpoints/Methods
- Parameters
- Return values
- Code examples

### 6. Troubleshooting
- Common errors
- Debug strategies
- FAQ

### 7. Examples
- Real-world use cases
- Code samples
- Integration examples

## WRITING GUIDELINES
- Use clear, concise language
- Include code examples
- Add visual diagrams where helpful
- Anticipate user questions
- Test all code samples`,
    category: "Documentation",
    tags: ["documentation", "technical-writing", "api", "guides"],
    author: "System",
    rating: 4.5,
    totalRatings: 92,
    favorites: 67,
    uses: 543,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    difficulty: "Intermediate",
    promptType: "golden",
  },
  {
    id: "6",
    title: "Business Strategy Consultant",
    description: "Analyze business challenges and develop strategic recommendations",
    prompt: `# BUSINESS STRATEGY CONSULTANT

## ROLE
You are a management consultant with expertise in business strategy, market analysis, and organizational development.

## CONTEXT
Company: [Company name and industry]
Challenge: [Describe the business challenge]
Goals: [What you want to achieve]
Constraints: [Budget, time, resources]

## ANALYSIS FRAMEWORK

### 1. Situation Analysis
- Current state assessment
- Market dynamics
- Competitive landscape
- Internal capabilities

### 2. Problem Definition
- Root cause analysis
- Stakeholder impact
- Success criteria

### 3. Strategic Options
- Option A: [Approach]
  - Pros/Cons
  - Resource requirements
  - Risk assessment
- Option B: [Alternative]
- Option C: [Alternative]

### 4. Recommendation
- Preferred strategy
- Implementation roadmap
- Key milestones
- Success metrics

### 5. Risk Mitigation
- Potential obstacles
- Contingency plans
- Early warning indicators

## OUTPUT REQUIREMENTS
- Data-driven insights
- Actionable recommendations
- Clear implementation steps
- ROI projections
- Timeline estimates`,
    category: "Business",
    tags: ["strategy", "consulting", "business", "analysis"],
    author: "System",
    rating: 4.8,
    totalRatings: 167,
    favorites: 134,
    uses: 892,
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
    difficulty: "Advanced",
    promptType: "context",
  },
  {
    id: "7",
    title: "Content SEO Optimizer",
    description: "Optimize content for search engines while maintaining quality",
    prompt: `# CONTENT SEO OPTIMIZER

## ROLE
You are an SEO specialist with expertise in content optimization, keyword research, and search intent.

## TASK
Optimize the following content for SEO:

[Paste your content here]

Target Keyword: [Primary keyword]
Secondary Keywords: [Related keywords]
Target Audience: [Who you're writing for]

## OPTIMIZATION CHECKLIST

### 1. Keyword Optimization
- Primary keyword in title
- Keywords in first 100 words
- Natural keyword density (1-2%)
- LSI keywords included
- Keyword in meta description

### 2. Content Structure
- Clear H1 (one per page)
- Logical H2/H3 hierarchy
- Short paragraphs (2-3 sentences)
- Bullet points for scannability
- Internal linking opportunities

### 3. Readability
- Grade level: 8th grade or below
- Active voice
- Short sentences
- Transition words
- Clear call-to-action

### 4. Technical SEO
- Meta title (50-60 characters)
- Meta description (150-160 characters)
- Image alt text suggestions
- URL slug recommendation
- Schema markup opportunities

## OUTPUT
- Optimized content
- SEO score (1-100)
- Improvement suggestions
- Keyword placement report`,
    category: "Marketing",
    tags: ["seo", "content", "optimization", "keywords"],
    author: "System",
    rating: 4.6,
    totalRatings: 189,
    favorites: 156,
    uses: 1567,
    createdAt: Date.now() - 35 * 24 * 60 * 60 * 1000,
    difficulty: "Intermediate",
    promptType: "golden",
  },
  {
    id: "8",
    title: "Debugging Assistant",
    description: "Systematic approach to finding and fixing bugs",
    prompt: `# DEBUGGING ASSISTANT

## ROLE
You are an expert debugger with deep knowledge of common bugs, debugging techniques, and problem-solving strategies.

## DEBUGGING PROCESS

### Step 1: Problem Understanding
- What is the expected behavior?
- What is the actual behavior?
- When did it start happening?
- Can you reproduce it consistently?

### Step 2: Information Gathering
- Error messages (full stack trace)
- Code snippet (relevant sections)
- Environment details (OS, versions, etc.)
- Recent changes
- Input data that causes the issue

### Step 3: Hypothesis Formation
Based on the information, I'll form hypotheses about:
- Most likely causes
- Less likely but possible causes
- Edge cases to consider

### Step 4: Systematic Investigation
- Isolate the problem
- Test hypotheses
- Use debugging tools
- Check assumptions

### Step 5: Solution & Prevention
- Root cause explanation
- Fix implementation
- Test cases to add
- Prevention strategies

## PROVIDE
[Paste error message and relevant code]

## OUTPUT
- Root cause analysis
- Step-by-step fix
- Explanation of why it happened
- How to prevent similar issues`,
    category: "Development",
    tags: ["debugging", "troubleshooting", "problem-solving", "development"],
    author: "System",
    rating: 4.9,
    totalRatings: 234,
    favorites: 198,
    uses: 1876,
    createdAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
    difficulty: "Advanced",
    promptType: "chain",
  },
]

export default function LibraryPage() {
  const [prompts, setPrompts] = useState<PromptTemplate[]>(INITIAL_PROMPTS)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [sortBy, setSortBy] = useState<"popular" | "recent" | "rating">("popular")
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate | null>(null)
  const [userRatings, setUserRatings] = useState<Record<string, number>>({})
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showAddPrompt, setShowAddPrompt] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // New prompt form state
  const [newPrompt, setNewPrompt] = useState({
    title: "",
    description: "",
    prompt: "",
    category: "Development",
    tags: "",
    difficulty: "Intermediate" as const,
    promptType: "golden",
  })

  useEffect(() => {
    const savedFavorites = localStorage.getItem("promptFavorites")
    const savedRatings = localStorage.getItem("promptRatings")
    const savedPrompts = localStorage.getItem("userPrompts")

    if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)))
    if (savedRatings) setUserRatings(JSON.parse(savedRatings))
    if (savedPrompts) {
      const userPrompts = JSON.parse(savedPrompts)
      setPrompts([...INITIAL_PROMPTS, ...userPrompts])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("promptFavorites", JSON.stringify(Array.from(favorites)))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem("promptRatings", JSON.stringify(userRatings))
  }, [userRatings])

  const showNotification = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const categories = ["All", ...Array.from(new Set(prompts.map((p) => p.category)))]
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced", "Expert"]

  const filteredPrompts = prompts
    .filter((prompt) => {
      const matchesSearch =
        searchQuery === "" ||
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || prompt.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === "All" || prompt.difficulty === selectedDifficulty

      return matchesSearch && matchesCategory && matchesDifficulty
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.uses - a.uses
        case "recent":
          return b.createdAt - a.createdAt
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
      showNotification("Removed from favorites")
    } else {
      newFavorites.add(id)
      showNotification("Added to favorites")
    }
    setFavorites(newFavorites)

    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, favorites: p.favorites + (newFavorites.has(id) ? 1 : -1) } : p)),
    )
  }

  const ratePrompt = (id: string, rating: number) => {
    setUserRatings({ ...userRatings, [id]: rating })
    showNotification(`Rated ${rating} stars`)

    setPrompts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newTotalRatings = p.totalRatings + 1
          const newRating = (p.rating * p.totalRatings + rating) / newTotalRatings
          return { ...p, rating: newRating, totalRatings: newTotalRatings }
        }
        return p
      }),
    )
  }

  const copyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      showNotification("Copied to clipboard!")
    } catch (error) {
      showNotification("Failed to copy")
    }
  }

  const usePrompt = (prompt: PromptTemplate) => {
    setPrompts((prev) => prev.map((p) => (p.id === prompt.id ? { ...p, uses: p.uses + 1 } : p)))
    copyPrompt(prompt.prompt)
  }

  const submitNewPrompt = () => {
    if (!newPrompt.title || !newPrompt.description || !newPrompt.prompt) {
      showNotification("Please fill in all required fields")
      return
    }

    const prompt: PromptTemplate = {
      id: Date.now().toString(),
      title: newPrompt.title,
      description: newPrompt.description,
      prompt: newPrompt.prompt,
      category: newPrompt.category,
      tags: newPrompt.tags.split(",").map((t) => t.trim()),
      author: "User",
      rating: 0,
      totalRatings: 0,
      favorites: 0,
      uses: 0,
      createdAt: Date.now(),
      difficulty: newPrompt.difficulty,
      promptType: newPrompt.promptType,
    }

    const userPrompts = prompts.filter((p) => p.author === "User")
    userPrompts.push(prompt)
    localStorage.setItem("userPrompts", JSON.stringify(userPrompts))

    setPrompts([...prompts, prompt])
    setShowAddPrompt(false)
    setNewPrompt({
      title: "",
      description: "",
      prompt: "",
      category: "Development",
      tags: "",
      difficulty: "Intermediate",
      promptType: "golden",
    })
    showNotification("Prompt added successfully!")
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Intermediate":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "Advanced":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "Expert":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return ""
    }
  }

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      showNotification("Copied to clipboard!")
    } catch (error) {
      showNotification("Failed to copy")
    }
  }

  if (selectedPrompt) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {showToast && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
            <Card className="p-4 shadow-lg border-2 border-green-500/50 bg-green-500/10">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="font-medium">{toastMessage}</span>
              </div>
            </Card>
          </div>
        )}

        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
          <Button variant="ghost" onClick={() => setSelectedPrompt(null)} className="mb-6">
            ← Back to Library
          </Button>

          <div className="space-y-6">
            <header className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{selectedPrompt.title}</h1>
                  <p className="text-xl text-muted-foreground">{selectedPrompt.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => toggleFavorite(selectedPrompt.id)}
                  className="flex-shrink-0"
                >
                  <Heart className={`w-6 h-6 ${favorites.has(selectedPrompt.id) ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={getDifficultyColor(selectedPrompt.difficulty)}>{selectedPrompt.difficulty}</Badge>
                <Badge variant="outline">{selectedPrompt.category}</Badge>
                <Badge variant="secondary">{selectedPrompt.promptType}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-medium">
                    {typeof selectedPrompt.rating === "number" ? selectedPrompt.rating.toFixed(1) : "N/A"}
                  </span>
                  <span className="text-muted-foreground text-sm">({selectedPrompt.totalRatings})</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  {selectedPrompt.uses} uses
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Heart className="w-4 h-4" />
                  {selectedPrompt.favorites} favorites
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {selectedPrompt.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleCopyPrompt(selectedPrompt.prompt)} className="gap-2">
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy & Use"}
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>

              <Card className="p-4 bg-muted/50">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Rate this prompt:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => ratePrompt(selectedPrompt.id, star)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            (userRatings[selectedPrompt.id] || 0) >= star
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {userRatings[selectedPrompt.id] && (
                    <span className="text-sm text-muted-foreground">You rated: {userRatings[selectedPrompt.id]}</span>
                  )}
                </div>
              </Card>
            </header>

            <Card className="p-8">
              <h2 className="text-xl font-semibold mb-4">Prompt Template</h2>
              <div className="bg-muted/50 rounded-lg p-6 border">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{selectedPrompt.prompt}</pre>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <h3 className="font-semibold mb-2">How to Use</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Click "Copy & Use" to copy the prompt to your clipboard</li>
                <li>2. Paste it into your AI tool (ChatGPT, Claude, etc.)</li>
                <li>3. Fill in the bracketed sections with your specific information</li>
                <li>4. Adjust any sections to better fit your needs</li>
                <li>5. Rate the prompt to help others find quality templates</li>
              </ol>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <Card className="p-4 shadow-lg border-2 border-green-500/50 bg-green-500/10">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="font-medium">{toastMessage}</span>
            </div>
          </Card>
        </div>
      )}

      {showAddPrompt && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddPrompt(false)}
        >
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Submit New Prompt</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowAddPrompt(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Code Review Assistant"
                  value={newPrompt.title}
                  onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of what this prompt does..."
                  value={newPrompt.description}
                  onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="prompt">Prompt Template *</Label>
                <Textarea
                  id="prompt"
                  placeholder="Paste your full prompt template here..."
                  value={newPrompt.prompt}
                  onChange={(e) => setNewPrompt({ ...newPrompt, prompt: e.target.value })}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newPrompt.category}
                    onValueChange={(value) => setNewPrompt({ ...newPrompt, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((c) => c !== "All")
                        .map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={newPrompt.difficulty}
                    onValueChange={(value: any) => setNewPrompt({ ...newPrompt, difficulty: value })}
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., code-review, development, quality"
                  value={newPrompt.tags}
                  onChange={(e) => setNewPrompt({ ...newPrompt, tags: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={submitNewPrompt} className="flex-1">
                  Submit Prompt
                </Button>
                <Button variant="outline" onClick={() => setShowAddPrompt(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        <header className="text-center space-y-3 mb-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Star className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Prompt Library</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse, search, and use production-ready prompt templates for every use case
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                ← Back to Generator
              </Button>
            </Link>
            <Button size="sm" onClick={() => setShowAddPrompt(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Submit Prompt
            </Button>
          </div>
        </header>

        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search prompts by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2 items-center">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Category:</span>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">Difficulty:</span>
              {difficulties.map((diff) => (
                <Button
                  key={diff}
                  variant={selectedDifficulty === diff ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(diff)}
                >
                  {diff}
                </Button>
              ))}
            </div>

            <div className="flex gap-2 items-center ml-auto">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Button
                variant={sortBy === "popular" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("popular")}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Popular
              </Button>
              <Button
                variant={sortBy === "recent" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("recent")}
              >
                <Clock className="w-4 h-4 mr-1" />
                Recent
              </Button>
              <Button
                variant={sortBy === "rating" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("rating")}
              >
                <Star className="w-4 h-4 mr-1" />
                Rating
              </Button>
            </div>
          </div>
        </div>

        {filteredPrompts.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No prompts found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            <Button onClick={() => setShowAddPrompt(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Submit Your Own Prompt
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <Card
                key={prompt.id}
                className="p-6 hover:bg-accent/50 transition-all cursor-pointer group"
                onClick={() => setSelectedPrompt(prompt)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <Badge className={getDifficultyColor(prompt.difficulty)}>{prompt.difficulty}</Badge>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(prompt.id)
                      }}
                      className="hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`w-5 h-5 ${favorites.has(prompt.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                      />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {prompt.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{prompt.description}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span>{typeof prompt.rating === "number" ? prompt.rating.toFixed(1) : "N/A"}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{prompt.uses}</span>
                    </div>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      {prompt.category}
                    </Badge>
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    {prompt.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {prompt.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{prompt.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-start gap-4">
            <Plus className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Share Your Prompts</h3>
              <p className="text-muted-foreground mb-4">
                Have a great prompt template? Share it with the community and help others create better AI interactions.
              </p>
              <Button onClick={() => setShowAddPrompt(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Submit Your Prompt
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
