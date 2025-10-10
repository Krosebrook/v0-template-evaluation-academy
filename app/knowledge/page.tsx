"use client"

import { useState } from "react"
import { Search, BookOpen, Users, Lightbulb, FileText, ChevronRight, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface KnowledgeArticle {
  id: string
  title: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  readTime: string
  content: string
  tags: string[]
}

const KNOWLEDGE_BASE: KnowledgeArticle[] = [
  {
    id: "golden-prompts",
    title: "What Are Golden Prompts?",
    description: "Learn the fundamentals of golden prompts and why they're essential for production AI applications",
    category: "Fundamentals",
    difficulty: "Beginner",
    readTime: "5 min",
    tags: ["golden", "basics", "fundamentals"],
    content: `# What Are Golden Prompts?

Golden prompts are comprehensive, production-ready prompts that incorporate all best practices for AI interactions. They are called "golden" because they represent the gold standard in prompt engineering.

## Key Characteristics

1. **Comprehensive Role Definition**: Clearly defines the AI's expertise and perspective
2. **Rich Context**: Provides all necessary background information
3. **Clear Objectives**: Specifies exactly what output is expected
4. **Structured Format**: Organizes information in a logical, scannable way
5. **Validation Criteria**: Includes success metrics and quality checks

## When to Use Golden Prompts

- Production applications requiring consistent quality
- Complex tasks needing detailed guidance
- Multi-step processes with specific requirements
- High-stakes scenarios where accuracy is critical

## Example Structure

\`\`\`
# ROLE & EXPERTISE
You are a [specific role] with expertise in [domain]

# CONTEXT
[Background information and constraints]

# OBJECTIVE
[Clear goal and success criteria]

# OUTPUT FORMAT
[Specific structure requirements]

# VALIDATION
[Quality checks and metrics]
\`\`\`

Golden prompts take more time to craft but deliver significantly better and more consistent results.`,
  },
  {
    id: "meta-prompts",
    title: "Understanding Meta Prompts",
    description: "Master the art of prompts that help AI generate better prompts",
    category: "Advanced Techniques",
    difficulty: "Expert",
    readTime: "8 min",
    tags: ["meta", "advanced", "recursive"],
    content: `# Understanding Meta Prompts

Meta prompts are prompts about prompts - they instruct AI to analyze requirements and generate optimal prompts for specific tasks.

## Why Meta Prompts Matter

Meta prompts are powerful because they:
- Leverage AI's understanding of prompt engineering
- Adapt to specific use cases automatically
- Improve over time through iteration
- Reduce manual prompt crafting effort

## Structure of Effective Meta Prompts

1. **Define the Meta-Task**: Explain that the AI should generate a prompt
2. **Provide Context**: Share the end goal and constraints
3. **Specify Quality Criteria**: What makes a good prompt for this use case
4. **Include Examples**: Show what good prompts look like
5. **Request Analysis**: Ask AI to explain its prompt design choices

## Example Meta Prompt

\`\`\`
You are an expert prompt engineer. Analyze the following request and generate an optimal prompt:

USER REQUEST: [specific task]

Generate a prompt that:
- Clearly defines the AI's role
- Provides comprehensive context
- Specifies exact deliverables
- Includes validation criteria

After generating the prompt, explain your design choices.
\`\`\`

## Advanced Techniques

- **Recursive Refinement**: Use meta prompts to improve existing prompts
- **Domain Adaptation**: Generate specialized prompts for specific industries
- **Quality Scoring**: Have AI rate and improve its own prompt generations`,
  },
  {
    id: "context-engineering",
    title: "Context Engineering Mastery",
    description: "Learn how to craft multi-layered context for nuanced AI responses",
    category: "Advanced Techniques",
    difficulty: "Advanced",
    readTime: "10 min",
    tags: ["context", "engineering", "advanced"],
    content: `# Context Engineering Mastery

Context engineering is the practice of carefully structuring and layering information to guide AI toward optimal responses.

## The Context Stack

Think of context as layers in a stack, each providing different types of information:

### Layer 1: Environmental Context
- Domain and industry
- Technical constraints
- Audience characteristics
- Time and resource limitations

### Layer 2: Situational Context
- Current state and history
- Specific challenges
- Available resources
- Success criteria

### Layer 3: Relational Context
- Stakeholder perspectives
- Dependencies and connections
- Trade-offs and priorities
- Risk factors

### Layer 4: Operational Context
- Execution requirements
- Quality standards
- Validation methods
- Iteration processes

## Context Optimization Techniques

**1. Information Density**
Pack maximum relevant information in minimum tokens:
- Use bullet points over paragraphs
- Employ abbreviations consistently
- Reference rather than repeat

**2. Context Positioning**
Place most critical context early:
- Primary objective first
- Supporting details second
- Edge cases last

**3. Context Chunking**
Break complex context into digestible sections:
- Use clear headers
- Separate concerns
- Create visual hierarchy

**4. Context Validation**
Ensure context is complete:
- Check for assumptions
- Verify all requirements covered
- Test with edge cases

## Common Context Pitfalls

- **Over-contextualization**: Too much irrelevant information
- **Under-specification**: Missing critical details
- **Ambiguity**: Unclear or contradictory context
- **Assumption gaps**: Unstated prerequisites

## Best Practices

1. Start broad, then narrow
2. Use examples to clarify
3. State assumptions explicitly
4. Provide context hierarchy
5. Test with variations`,
  },
  {
    id: "persona-selection",
    title: "Choosing the Right Personas",
    description: "Strategic guide to selecting and combining AI personas for optimal results",
    category: "Personas",
    difficulty: "Intermediate",
    readTime: "6 min",
    tags: ["personas", "strategy", "selection"],
    content: `# Choosing the Right Personas

Personas shape how AI approaches problems. Selecting the right combination is crucial for quality outputs.

## Persona Categories

### Analytical Personas
- **Expert Analyst**: Deep domain knowledge, systematic thinking
- **Researcher**: Evidence-based, comprehensive investigation
- **Critic**: Identifies flaws, suggests improvements

**Best for**: Technical analysis, quality assurance, research

### Creative Personas
- **Creative Innovator**: Novel solutions, unconventional thinking
- **Artist**: Aesthetic focus, emotional resonance
- **Strategist**: Long-term vision, big-picture thinking

**Best for**: Brainstorming, design, innovation

### Practical Personas
- **Engineer**: Implementation-focused, technical precision
- **Consultant**: ROI-driven, business pragmatism
- **Teacher**: Clear explanations, educational approach

**Best for**: Implementation, business decisions, documentation

## Persona Combination Strategies

### Single Persona
Use when you need:
- Highly specialized expertise
- Consistent voice and perspective
- Focused, narrow analysis

### Dual Personas
Combine complementary perspectives:
- **Engineer + Creative**: Innovative yet practical solutions
- **Expert + Teacher**: Deep knowledge, clearly explained
- **Critic + Consultant**: Quality focus with business sense

### Multi-Persona
Use 3+ personas for:
- Complex, multi-faceted problems
- Comprehensive analysis
- Balanced decision-making

## Selection Framework

**Step 1: Define Your Goal**
- What outcome do you need?
- What perspective is most valuable?
- What constraints exist?

**Step 2: Map Required Expertise**
- Technical skills needed
- Domain knowledge required
- Soft skills important

**Step 3: Choose Primary Persona**
- Select the most critical perspective
- This sets the overall tone

**Step 4: Add Supporting Personas**
- Fill gaps in expertise
- Balance the primary perspective
- Add depth to analysis

**Step 5: Test and Refine**
- Generate sample outputs
- Evaluate quality and fit
- Adjust combination as needed

## Common Combinations

**For Product Development**
Engineer + Creative + Consultant

**For Content Creation**
Creative + Teacher + Critic

**For Technical Documentation**
Engineer + Teacher + Expert

**For Business Strategy**
Strategist + Consultant + Analyst

**For Research**
Researcher + Expert + Critic`,
  },
  {
    id: "layer-system",
    title: "The Layer System Explained",
    description: "Deep dive into prompt layers and how to use them effectively",
    category: "Fundamentals",
    difficulty: "Intermediate",
    readTime: "7 min",
    tags: ["layers", "structure", "fundamentals"],
    content: `# The Layer System Explained

Prompt layers are modular components that structure your prompts for maximum effectiveness.

## Essential Layers

### 1. Role Definition
**Purpose**: Establishes AI's identity and expertise
**When to use**: Always - this is foundational
**Example**:
\`\`\`
You are a senior software architect with 15 years of experience in distributed systems.
\`\`\`

### 2. Context Setting
**Purpose**: Provides background and constraints
**When to use**: Always - context shapes responses
**Example**:
\`\`\`
Context: Building a real-time chat application for 100K concurrent users.
Constraints: Must use existing PostgreSQL database, $5K/month budget.
\`\`\`

### 3. Task Specification
**Purpose**: Defines clear objectives and deliverables
**When to use**: Always - without this, outputs are unfocused
**Example**:
\`\`\`
Task: Design the database schema and caching strategy.
Deliverables: ER diagram, Redis caching plan, scaling approach.
\`\`\`

## Optional Layers

### 4. Output Format
**Purpose**: Specifies structure and presentation
**When to use**: When format matters for usability
**Example**:
\`\`\`
Format:
1. Executive Summary (3-5 sentences)
2. Detailed Analysis (bullet points)
3. Recommendations (numbered list)
4. Next Steps (action items)
\`\`\`

### 5. Examples
**Purpose**: Demonstrates desired output quality
**When to use**: For complex or nuanced tasks
**Example**:
\`\`\`
Example of good output:
"Recommendation: Implement Redis caching for user sessions.
Rationale: Reduces database load by 70%, improves response time from 200ms to 50ms.
Implementation: Use Redis Cluster with 3 nodes, TTL of 24 hours."
\`\`\`

### 6. Constraints
**Purpose**: Sets boundaries and limitations
**When to use**: When specific restrictions apply
**Example**:
\`\`\`
Constraints:
- Must be implementable in 2 weeks
- No new infrastructure costs
- Compatible with existing auth system
- Maintain 99.9% uptime during migration
\`\`\`

### 7. Tone & Style
**Purpose**: Defines communication approach
**When to use**: When audience or brand voice matters
**Example**:
\`\`\`
Tone: Professional yet approachable, technical but accessible to non-engineers.
Style: Use analogies, avoid jargon, include visual diagrams.
\`\`\`

### 8. Validation Criteria
**Purpose**: Establishes quality checks
**When to use**: For high-stakes or complex outputs
**Example**:
\`\`\`
Validation:
✓ All requirements addressed
✓ Trade-offs explicitly stated
✓ Cost estimates included
✓ Risk factors identified
✓ Timeline is realistic
\`\`\`

## Layer Selection Strategy

**Minimum Viable Prompt**: Role + Context + Task (3 layers)
**Standard Prompt**: Add Format + Constraints (5 layers)
**Golden Prompt**: All 8 layers for production use

## Layer Ordering Best Practices

1. **Role** - Establish identity first
2. **Context** - Set the stage
3. **Task** - Define the goal
4. **Format** - Specify structure
5. **Examples** - Show quality standards
6. **Constraints** - Set boundaries
7. **Tone** - Define communication style
8. **Validation** - Ensure quality

## Common Mistakes

- **Layer Overload**: Using all layers when unnecessary
- **Missing Essentials**: Skipping Role, Context, or Task
- **Poor Ordering**: Putting validation before task definition
- **Redundancy**: Repeating information across layers
- **Vagueness**: Layers that don't add specific value`,
  },
  {
    id: "prompt-testing",
    title: "Testing and Iterating Prompts",
    description: "Systematic approach to evaluating and improving prompt quality",
    category: "Quality Assurance",
    difficulty: "Intermediate",
    readTime: "8 min",
    tags: ["testing", "iteration", "quality"],
    content: `# Testing and Iterating Prompts

Great prompts are rarely perfect on the first try. Systematic testing and iteration are essential.

## Testing Framework

### Phase 1: Baseline Testing
**Goal**: Establish initial performance

1. **Generate 3-5 outputs** with the same prompt
2. **Evaluate consistency**: Are outputs similar in quality?
3. **Check completeness**: Are all requirements met?
4. **Assess quality**: Does it meet your standards?

### Phase 2: Edge Case Testing
**Goal**: Find failure modes

Test with:
- Minimal input
- Maximum complexity
- Ambiguous requests
- Contradictory requirements
- Missing information

### Phase 3: Variation Testing
**Goal**: Optimize prompt elements

Test variations of:
- Role definitions
- Context depth
- Task specificity
- Format requirements
- Example quality

### Phase 4: A/B Testing
**Goal**: Compare alternatives

Create 2-3 prompt versions:
- Different persona combinations
- Alternative layer selections
- Varied instruction styles

Generate outputs and compare systematically.

## Evaluation Criteria

### Accuracy
- Factual correctness
- Logical consistency
- Requirement coverage

### Relevance
- On-topic responses
- Appropriate depth
- Useful insights

### Clarity
- Easy to understand
- Well-structured
- Scannable format

### Completeness
- All aspects addressed
- No critical gaps
- Sufficient detail

### Actionability
- Practical recommendations
- Clear next steps
- Implementable advice

## Iteration Strategies

### Strategy 1: Incremental Refinement
Make small changes, test, repeat:
1. Identify weakest aspect
2. Make targeted improvement
3. Test new version
4. Compare to baseline
5. Keep if better, revert if worse

### Strategy 2: Component Isolation
Test individual elements:
1. Remove one layer
2. Evaluate impact
3. Restore or keep removed
4. Repeat for each layer

### Strategy 3: Persona Experimentation
Systematically test personas:
1. Start with single persona
2. Add second persona
3. Evaluate improvement
4. Try different combinations
5. Find optimal mix

### Strategy 4: Format Optimization
Refine output structure:
1. Test different formats
2. Measure readability
3. Check completeness
4. Optimize for use case

## Metrics to Track

**Quantitative**
- Output length (characters/words)
- Generation time
- Consistency score (similarity between runs)
- Requirement coverage (% of specs met)

**Qualitative**
- Usefulness rating (1-5)
- Clarity rating (1-5)
- Actionability rating (1-5)
- Overall satisfaction (1-5)

## Common Issues and Fixes

**Issue**: Outputs too generic
**Fix**: Add more specific context and examples

**Issue**: Inconsistent quality
**Fix**: Strengthen role definition and validation criteria

**Issue**: Missing requirements
**Fix**: Make task specification more explicit

**Issue**: Wrong tone
**Fix**: Add tone/style layer with clear examples

**Issue**: Too verbose
**Fix**: Add format constraints and length limits

**Issue**: Not actionable
**Fix**: Request specific recommendations and next steps

## Best Practices

1. **Test systematically**, not randomly
2. **Document changes** and results
3. **Use version control** for prompts
4. **Maintain test cases** for regression testing
5. **Iterate based on data**, not intuition
6. **Set quality thresholds** before testing
7. **Test with real use cases**, not hypotheticals`,
  },
]

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null)

  const categories = ["All", ...Array.from(new Set(KNOWLEDGE_BASE.map((a) => a.category)))]
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced", "Expert"]

  const filteredArticles = KNOWLEDGE_BASE.filter((article) => {
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || article.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Fundamentals":
        return BookOpen
      case "Advanced Techniques":
        return Lightbulb
      case "Personas":
        return Users
      case "Quality Assurance":
        return Star
      default:
        return FileText
    }
  }

  if (selectedArticle) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
          <Button variant="ghost" onClick={() => setSelectedArticle(null)} className="mb-6">
            ← Back to Knowledge Base
          </Button>

          <article className="space-y-6">
            <header className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={getDifficultyColor(selectedArticle.difficulty)}>{selectedArticle.difficulty}</Badge>
                <Badge variant="outline">{selectedArticle.category}</Badge>
                <span className="text-sm text-muted-foreground">{selectedArticle.readTime} read</span>
              </div>
              <h1 className="text-4xl font-bold">{selectedArticle.title}</h1>
              <p className="text-xl text-muted-foreground">{selectedArticle.description}</p>
              <div className="flex gap-2 flex-wrap">
                {selectedArticle.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </header>

            <Card className="p-8">
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed">{selectedArticle.content}</div>
              </div>
            </Card>
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
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Knowledge Base</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive guides and tutorials on prompt engineering, personas, layers, and best practices
          </p>
        </header>

        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search articles, topics, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground self-center">Category:</span>
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

            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground self-center">Difficulty:</span>
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
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => {
              const CategoryIcon = getCategoryIcon(article.category)
              return (
                <Card
                  key={article.id}
                  className="p-6 hover:bg-accent/50 transition-all cursor-pointer group"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <CategoryIcon className="w-5 h-5 text-primary" />
                      </div>
                      <Badge className={getDifficultyColor(article.difficulty)}>{article.difficulty}</Badge>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{article.readTime}</span>
                      <span className="flex items-center gap-1">
                        Read more <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>

                    <div className="flex gap-1 flex-wrap">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        <Card className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-start gap-4">
            <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Can't find what you're looking for?</h3>
              <p className="text-muted-foreground mb-4">
                Our knowledge base is constantly growing. Check back soon for more articles on advanced prompt
                engineering techniques, industry-specific guides, and case studies.
              </p>
              <Link href="/">
                <Button variant="outline">Back to Prompt Generator</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
