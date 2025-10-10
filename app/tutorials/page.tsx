"use client"

import { useState, useEffect } from "react"
import {
  GraduationCap,
  Play,
  CheckCircle,
  Lock,
  Trophy,
  Star,
  BookOpen,
  Code,
  Zap,
  Target,
  Award,
  TrendingUp,
  Clock,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface Tutorial {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  duration: string
  lessons: number
  category: string
  icon: any
  prerequisites?: string[]
  skills: string[]
  xp: number
}

interface UserProgress {
  completedTutorials: string[]
  currentTutorial: string | null
  currentLesson: number
  totalXP: number
  achievements: string[]
}

const TUTORIALS: Tutorial[] = [
  {
    id: "prompt-basics",
    title: "Prompt Engineering Fundamentals",
    description: "Learn the core principles of effective prompt engineering from scratch",
    difficulty: "Beginner",
    duration: "30 min",
    lessons: 5,
    category: "Fundamentals",
    icon: BookOpen,
    skills: ["Basic Prompting", "Clear Instructions", "Context Setting"],
    xp: 100,
  },
  {
    id: "persona-mastery",
    title: "Mastering AI Personas",
    description: "Understand how to combine multiple personas for multi-faceted analysis",
    difficulty: "Beginner",
    duration: "25 min",
    lessons: 4,
    category: "Fundamentals",
    icon: Target,
    prerequisites: ["prompt-basics"],
    skills: ["Persona Selection", "Perspective Combination", "Expert Thinking"],
    xp: 100,
  },
  {
    id: "layer-architecture",
    title: "Prompt Layer Architecture",
    description: "Master the building blocks of well-structured prompts",
    difficulty: "Intermediate",
    duration: "35 min",
    lessons: 6,
    category: "Structure",
    icon: Code,
    prerequisites: ["prompt-basics"],
    skills: ["Layer Design", "Structure Planning", "Component Assembly"],
    xp: 150,
  },
  {
    id: "golden-prompts",
    title: "Creating Golden Prompts",
    description: "Build production-ready prompts with all best practices",
    difficulty: "Intermediate",
    duration: "40 min",
    lessons: 7,
    category: "Advanced Techniques",
    icon: Star,
    prerequisites: ["prompt-basics", "layer-architecture"],
    skills: ["Golden Prompt Design", "Best Practices", "Quality Assurance"],
    xp: 200,
  },
  {
    id: "chain-of-thought",
    title: "Chain-of-Thought Reasoning",
    description: "Guide AI through step-by-step logical reasoning",
    difficulty: "Intermediate",
    duration: "30 min",
    lessons: 5,
    category: "Advanced Techniques",
    icon: TrendingUp,
    prerequisites: ["prompt-basics"],
    skills: ["Logical Reasoning", "Step-by-Step Thinking", "Problem Decomposition"],
    xp: 150,
  },
  {
    id: "context-engineering",
    title: "Advanced Context Engineering",
    description: "Create multi-layered context for nuanced AI responses",
    difficulty: "Advanced",
    duration: "45 min",
    lessons: 8,
    category: "Advanced Techniques",
    icon: Zap,
    prerequisites: ["layer-architecture", "golden-prompts"],
    skills: ["Context Layering", "Nuanced Framing", "Advanced Structuring"],
    xp: 250,
  },
  {
    id: "meta-prompting",
    title: "Meta Prompting Mastery",
    description: "Create prompts that help AI generate better prompts",
    difficulty: "Advanced",
    duration: "35 min",
    lessons: 6,
    category: "Expert Level",
    icon: Award,
    prerequisites: ["golden-prompts", "context-engineering"],
    skills: ["Meta-Level Thinking", "Prompt Generation", "Self-Improvement"],
    xp: 250,
  },
  {
    id: "recursive-refinement",
    title: "Recursive Refinement Techniques",
    description: "Master self-improving prompts through iterations",
    difficulty: "Expert",
    duration: "50 min",
    lessons: 9,
    category: "Expert Level",
    icon: Trophy,
    prerequisites: ["meta-prompting", "context-engineering"],
    skills: ["Iterative Improvement", "Self-Critique", "Optimization"],
    xp: 300,
  },
]

const ACHIEVEMENTS = [
  { id: "first-tutorial", name: "First Steps", description: "Complete your first tutorial", icon: GraduationCap },
  { id: "beginner-complete", name: "Beginner Graduate", description: "Complete all beginner tutorials", icon: Star },
  {
    id: "intermediate-complete",
    name: "Intermediate Master",
    description: "Complete all intermediate tutorials",
    icon: Award,
  },
  { id: "advanced-complete", name: "Advanced Expert", description: "Complete all advanced tutorials", icon: Trophy },
  { id: "all-complete", name: "Prompt Master", description: "Complete all tutorials", icon: Trophy },
  { id: "speed-learner", name: "Speed Learner", description: "Complete 3 tutorials in one day", icon: Zap },
  { id: "xp-1000", name: "XP Collector", description: "Earn 1000 XP", icon: TrendingUp },
]

export default function TutorialsPage() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedTutorials: [],
    currentTutorial: null,
    currentLesson: 0,
    totalXP: 0,
    achievements: [],
  })
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  useEffect(() => {
    const saved = localStorage.getItem("tutorialProgress")
    if (saved) {
      setUserProgress(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("tutorialProgress", JSON.stringify(userProgress))
  }, [userProgress])

  const categories = ["All", ...Array.from(new Set(TUTORIALS.map((t) => t.category)))]

  const filteredTutorials =
    selectedCategory === "All" ? TUTORIALS : TUTORIALS.filter((t) => t.category === selectedCategory)

  const isTutorialUnlocked = (tutorial: Tutorial) => {
    if (!tutorial.prerequisites) return true
    return tutorial.prerequisites.every((prereq) => userProgress.completedTutorials.includes(prereq))
  }

  const getTutorialStatus = (tutorialId: string) => {
    if (userProgress.completedTutorials.includes(tutorialId)) return "completed"
    if (userProgress.currentTutorial === tutorialId) return "in-progress"
    return "locked"
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

  const completedCount = userProgress.completedTutorials.length
  const totalCount = TUTORIALS.length
  const overallProgress = (completedCount / totalCount) * 100

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => userProgress.achievements.includes(a.id))

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        <header className="text-center space-y-3 mb-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Interactive Tutorials</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master prompt engineering through hands-on, interactive lessons
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                ← Back to Generator
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6 mb-8">
          <Card className="p-6 h-fit">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Your Progress
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-semibold">
                      {completedCount}/{totalCount}
                    </span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total XP</span>
                    <span className="font-semibold">{userProgress.totalXP}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
                </h3>
                <div className="space-y-2">
                  {ACHIEVEMENTS.map((achievement) => {
                    const unlocked = userProgress.achievements.includes(achievement.id)
                    const Icon = achievement.icon
                    return (
                      <div
                        key={achievement.id}
                        className={`flex items-center gap-3 p-2 rounded-lg ${
                          unlocked ? "bg-primary/10" : "bg-muted/50 opacity-50"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${unlocked ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{achievement.name}</p>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                        {unlocked && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <div className="flex items-center gap-2 flex-wrap">
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

            <div className="grid md:grid-cols-2 gap-6">
              {filteredTutorials.map((tutorial) => {
                const Icon = tutorial.icon
                const isUnlocked = isTutorialUnlocked(tutorial)
                const status = getTutorialStatus(tutorial.id)
                const isCompleted = status === "completed"
                const isInProgress = status === "in-progress"

                return (
                  <Card
                    key={tutorial.id}
                    className={`p-6 transition-all ${
                      isUnlocked ? "hover:shadow-lg cursor-pointer" : "opacity-60"
                    } ${isCompleted ? "border-green-500/50 bg-green-500/5" : ""} ${
                      isInProgress ? "border-primary/50 bg-primary/5" : ""
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getDifficultyColor(tutorial.difficulty)}>{tutorial.difficulty}</Badge>
                          {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                          {!isUnlocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-2">{tutorial.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{tutorial.description}</p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {tutorial.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {tutorial.lessons} lessons
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {tutorial.xp} XP
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {tutorial.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
                          <div className="text-xs text-muted-foreground mb-3">
                            <span className="font-medium">Prerequisites:</span>{" "}
                            {tutorial.prerequisites
                              .map((prereq) => TUTORIALS.find((t) => t.id === prereq)?.title)
                              .join(", ")}
                          </div>
                        )}
                      </div>

                      <Link href={isUnlocked ? `/tutorials/${tutorial.id}` : "#"}>
                        <Button
                          className="w-full gap-2"
                          disabled={!isUnlocked}
                          variant={isCompleted ? "outline" : "default"}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Review Tutorial
                            </>
                          ) : isInProgress ? (
                            <>
                              <Play className="w-4 h-4" />
                              Continue Learning
                            </>
                          ) : isUnlocked ? (
                            <>
                              <Play className="w-4 h-4" />
                              Start Tutorial
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              Locked
                            </>
                          )}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>

        <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-start gap-4">
            <GraduationCap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Learning Path</h3>
              <p className="text-muted-foreground mb-4">
                Follow our structured learning path to master prompt engineering. Start with fundamentals, progress
                through intermediate techniques, and unlock advanced strategies as you build your skills.
              </p>
              <div className="flex gap-2">
                <Button className="gap-2">
                  <Play className="w-4 h-4" />
                  Start Learning Path
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <BookOpen className="w-4 h-4" />
                  View Curriculum
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
