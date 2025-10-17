import type { LucideIcon } from "lucide-react"
import type { Template, Generation, Profile } from "./database"

export interface FeatureBenefitProps {
  icon: LucideIcon
  title: string
  description: string
}

export interface TemplateCardProps {
  template: Template
  showActions?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export interface GenerationInterfaceProps {
  templateId: string
  template: Template
}

export interface AdminDashboardProps {
  users: Profile[]
  templates: Template[]
  evaluations: Generation[]
}

export interface AnalyticsDashboardProps {
  templates: Template[]
  evaluations: Generation[]
  users: Profile[]
  comments: Comment[]
}

export interface CourseContentProps {
  course: {
    id: string
    title: string
    description: string
    modules: CourseModule[]
  }
  progress: {
    completed_modules: string[]
    quiz_scores: Record<string, number>
  }
}

export interface CourseModule {
  id: string
  title: string
  content: string
  quiz?: Quiz
}

export interface Quiz {
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
}

export interface CollectionFormProps {
  collection?: {
    id: string
    name: string
    description: string
    is_public: boolean
  }
  onSuccess?: () => void
}

export interface TestResultsProps {
  results: {
    score: number
    total: number
    passed: boolean
    answers: TestAnswer[]
  }
}

export interface TestAnswer {
  question: string
  user_answer: string
  correct_answer: string
  is_correct: boolean
}

export interface ImportExportData {
  templates?: Template[]
  prompts?: unknown[]
  configs?: unknown[]
  history?: unknown[]
  favorites?: unknown[]
  tutorials?: unknown[]
}
