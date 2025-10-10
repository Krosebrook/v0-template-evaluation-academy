"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, CheckCircle, Code, Lightbulb, Target, Trophy, BookOpen } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Lesson {
  id: number
  title: string
  type: "theory" | "example" | "exercise" | "quiz"
  content: string
  example?: string
  exercise?: {
    prompt: string
    hint: string
    solution: string
  }
  quiz?: {
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }
}

const TUTORIAL_LESSONS: Record<string, Lesson[]> = {
  "prompt-basics": [
    {
      id: 1,
      title: "What is Prompt Engineering?",
      type: "theory",
      content: `Prompt engineering is the art and science of crafting instructions that help AI systems understand and respond to your needs effectively.

Think of it like giving directions to a helpful assistant. The clearer and more specific your instructions, the better the results you'll get.

Key principles:
• Be specific about what you want
• Provide relevant context
• Define the desired output format
• Set clear expectations

Just like learning any skill, prompt engineering improves with practice. Let's start with the fundamentals!`,
    },
    {
      id: 2,
      title: "The Anatomy of a Good Prompt",
      type: "example",
      content: `A well-structured prompt has three essential components:

1. **Role/Context**: Who is the AI and what expertise should it bring?
2. **Task**: What specific action or output do you want?
3. **Format**: How should the response be structured?

Let's see this in action:`,
      example: `BAD PROMPT:
"Tell me about marketing"

GOOD PROMPT:
"You are a digital marketing expert with 10 years of experience. Explain the top 3 social media marketing strategies for small businesses in 2024. Format your response as a numbered list with brief explanations for each strategy."

Notice how the good prompt:
✓ Defines the AI's role (marketing expert)
✓ Specifies the exact task (top 3 strategies for small businesses)
✓ Requests a specific format (numbered list with explanations)`,
    },
    {
      id: 3,
      title: "Practice: Write Your First Prompt",
      type: "exercise",
      content: `Now it's your turn! Let's practice writing a clear, specific prompt.

Your task: Write a prompt asking AI to help you create a weekly meal plan.

Remember to include:
• Role/expertise for the AI
• Specific requirements (dietary preferences, number of meals, etc.)
• Desired output format`,
      exercise: {
        prompt: "Write a prompt for creating a weekly meal plan:",
        hint: "Think about: What kind of expert should the AI be? What dietary needs do you have? How should the meal plan be organized?",
        solution: `Example solution:

"You are a professional nutritionist specializing in healthy meal planning. Create a 7-day dinner meal plan for a vegetarian who wants high-protein meals. For each day, provide:
- Meal name
- Main ingredients
- Estimated prep time
- Protein content

Format as a table with columns for Day, Meal, Ingredients, Prep Time, and Protein."

This prompt works because it:
✓ Defines expertise (nutritionist)
✓ Specifies requirements (vegetarian, high-protein, 7 days)
✓ Details the output format (table with specific columns)`,
      },
    },
    {
      id: 4,
      title: "Common Prompt Mistakes",
      type: "theory",
      content: `Let's learn from common mistakes so you can avoid them:

**Mistake 1: Being Too Vague**
❌ "Help me with my project"
✓ "Review my React component code and suggest performance optimizations"

**Mistake 2: No Context**
❌ "Write a blog post"
✓ "Write a 500-word blog post about sustainable fashion for millennials interested in ethical shopping"

**Mistake 3: Unclear Expectations**
❌ "Analyze this data"
✓ "Analyze this sales data and identify the top 3 trends, with specific metrics and recommendations"

**Mistake 4: Forgetting Output Format**
❌ "Give me marketing ideas"
✓ "Provide 5 marketing ideas in a numbered list, with budget estimates and expected ROI for each"

The pattern? Specificity wins every time!`,
    },
    {
      id: 5,
      title: "Knowledge Check",
      type: "quiz",
      content: "Let's test what you've learned!",
      quiz: {
        question: "Which of the following is the MOST important element of an effective prompt?",
        options: [
          "Using complex vocabulary to sound professional",
          "Being specific about what you want and providing context",
          "Making the prompt as short as possible",
          "Including multiple unrelated questions in one prompt",
        ],
        correctAnswer: 1,
        explanation: `Correct! Being specific and providing context is the foundation of effective prompting.

While brevity can be good, clarity and specificity are more important. Complex vocabulary doesn't help if the request isn't clear, and multiple unrelated questions should be separated into different prompts for better results.

Remember: Clear, specific, contextual prompts = better AI responses!`,
      },
    },
  ],
}

export default function TutorialLessonPage() {
  const params = useParams()
  const router = useRouter()
  const tutorialId = params.id as string

  const [currentLesson, setCurrentLesson] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  const lessons = TUTORIAL_LESSONS[tutorialId] || []
  const lesson = lessons[currentLesson]
  const progress = ((currentLesson + 1) / lessons.length) * 100

  useEffect(() => {
    const saved = localStorage.getItem(`tutorial-${tutorialId}-progress`)
    if (saved) {
      const data = JSON.parse(saved)
      setCompletedLessons(data.completedLessons || [])
      setCurrentLesson(data.currentLesson || 0)
    }
  }, [tutorialId])

  const saveProgress = () => {
    localStorage.setItem(
      `tutorial-${tutorialId}-progress`,
      JSON.stringify({
        completedLessons,
        currentLesson,
      }),
    )
  }

  const markLessonComplete = () => {
    if (!completedLessons.includes(lesson.id)) {
      setCompletedLessons([...completedLessons, lesson.id])
    }
  }

  const handleNext = () => {
    markLessonComplete()
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1)
      setUserAnswer("")
      setShowHint(false)
      setShowSolution(false)
      setSelectedQuizAnswer(null)
      setQuizSubmitted(false)
      saveProgress()
    } else {
      // Tutorial complete
      const tutorialProgress = JSON.parse(localStorage.getItem("tutorialProgress") || "{}")
      const completedTutorials = tutorialProgress.completedTutorials || []
      if (!completedTutorials.includes(tutorialId)) {
        completedTutorials.push(tutorialId)
        localStorage.setItem(
          "tutorialProgress",
          JSON.stringify({
            ...tutorialProgress,
            completedTutorials,
            totalXP: (tutorialProgress.totalXP || 0) + 100,
          }),
        )
      }
      router.push("/tutorials")
    }
  }

  const handlePrevious = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1)
      setUserAnswer("")
      setShowHint(false)
      setShowSolution(false)
      setSelectedQuizAnswer(null)
      setQuizSubmitted(false)
    }
  }

  const handleQuizSubmit = () => {
    if (selectedQuizAnswer !== null) {
      setQuizSubmitted(true)
      if (selectedQuizAnswer === lesson.quiz?.correctAnswer) {
        markLessonComplete()
      }
    }
  }

  if (!lesson) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Tutorial Not Found</h2>
          <p className="text-muted-foreground mb-4">This tutorial is not available yet.</p>
          <Link href="/tutorials">
            <Button>Back to Tutorials</Button>
          </Link>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <Link href="/tutorials">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tutorials
            </Button>
          </Link>

          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">
              Lesson {lesson.id}: {lesson.title}
            </h1>
            <Badge variant="outline">
              {currentLesson + 1} / {lessons.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="p-8 mb-6">
          <div className="space-y-6">
            {lesson.type === "theory" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-semibold">Theory</span>
                </div>
                <div className="prose prose-sm max-w-none">
                  {lesson.content.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {lesson.type === "example" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Lightbulb className="w-5 h-5" />
                  <span className="font-semibold">Example</span>
                </div>
                <div className="prose prose-sm max-w-none">
                  {lesson.content.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {lesson.example && (
                  <Card className="p-4 bg-muted/50 border-2">
                    <pre className="whitespace-pre-wrap font-mono text-sm">{lesson.example}</pre>
                  </Card>
                )}
              </div>
            )}

            {lesson.type === "exercise" && lesson.exercise && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Code className="w-5 h-5" />
                  <span className="font-semibold">Hands-On Exercise</span>
                </div>
                <div className="prose prose-sm max-w-none">
                  {lesson.content.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="space-y-3">
                  <label className="font-medium">{lesson.exercise.prompt}</label>
                  <Textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your prompt here..."
                    rows={8}
                    className="font-mono text-sm"
                  />

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowHint(!showHint)} size="sm">
                      {showHint ? "Hide" : "Show"} Hint
                    </Button>
                    <Button variant="outline" onClick={() => setShowSolution(!showSolution)} size="sm">
                      {showSolution ? "Hide" : "Show"} Solution
                    </Button>
                  </div>

                  {showHint && (
                    <Card className="p-4 bg-blue-500/10 border-blue-500/20">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm mb-1">Hint</p>
                          <p className="text-sm text-muted-foreground">{lesson.exercise.hint}</p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {showSolution && (
                    <Card className="p-4 bg-green-500/10 border-green-500/20">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm mb-2">Example Solution</p>
                          <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                            {lesson.exercise.solution}
                          </pre>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {lesson.type === "quiz" && lesson.quiz && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Target className="w-5 h-5" />
                  <span className="font-semibold">Knowledge Check</span>
                </div>

                <div className="space-y-4">
                  <p className="font-medium text-lg">{lesson.quiz.question}</p>

                  <div className="space-y-2">
                    {lesson.quiz.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => !quizSubmitted && setSelectedQuizAnswer(index)}
                        disabled={quizSubmitted}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedQuizAnswer === index
                            ? quizSubmitted
                              ? index === lesson.quiz?.correctAnswer
                                ? "border-green-500 bg-green-500/10"
                                : "border-red-500 bg-red-500/10"
                              : "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        } ${quizSubmitted && index === lesson.quiz?.correctAnswer ? "border-green-500 bg-green-500/10" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              selectedQuizAnswer === index
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground"
                            }`}
                          >
                            {selectedQuizAnswer === index && <div className="w-3 h-3 rounded-full bg-current" />}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {!quizSubmitted && (
                    <Button onClick={handleQuizSubmit} disabled={selectedQuizAnswer === null} className="w-full">
                      Submit Answer
                    </Button>
                  )}

                  {quizSubmitted && (
                    <Card
                      className={`p-4 ${
                        selectedQuizAnswer === lesson.quiz.correctAnswer
                          ? "bg-green-500/10 border-green-500/20"
                          : "bg-orange-500/10 border-orange-500/20"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {selectedQuizAnswer === lesson.quiz.correctAnswer ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Lightbulb className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-semibold text-sm mb-1">
                            {selectedQuizAnswer === lesson.quiz.correctAnswer ? "Correct!" : "Not quite right"}
                          </p>
                          <p className="text-sm text-muted-foreground">{lesson.quiz.explanation}</p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentLesson === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {completedLessons.length} / {lessons.length} lessons completed
          </div>

          <Button onClick={handleNext}>
            {currentLesson === lessons.length - 1 ? (
              <>
                <Trophy className="w-4 h-4 mr-2" />
                Complete Tutorial
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  )
}
