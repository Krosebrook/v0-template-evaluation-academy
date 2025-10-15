"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, Clock, Loader2, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Test {
  id: string
  test_type: string
  status: string
  score: number | null
  results: any
  error_message: string | null
  run_at: string
}

interface TestResultsProps {
  tests: Test[]
}

const testTypeLabels: Record<string, string> = {
  lighthouse: "Lighthouse Performance",
  accessibility: "Accessibility (WCAG)",
  security: "Security Scan",
  links: "Broken Links",
  code_quality: "Code Quality",
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "passed":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />
    case "failed":
      return <XCircle className="h-5 w-5 text-red-600" />
    case "running":
      return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
    case "pending":
      return <Clock className="h-5 w-5 text-gray-400" />
    default:
      return <AlertCircle className="h-5 w-5 text-yellow-600" />
  }
}

const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive"> = {
    passed: "default",
    failed: "destructive",
    running: "secondary",
    pending: "secondary",
  }

  return <Badge variant={variants[status] || "secondary"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
}

export function TestResults({ tests }: TestResultsProps) {
  if (tests.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No tests have been run yet. Click "Run All Tests" to start.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {tests.map((test) => (
        <Card key={test.id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(test.status)}
              <div>
                <h3 className="font-semibold">{testTypeLabels[test.test_type] || test.test_type}</h3>
                <p className="text-sm text-muted-foreground">{new Date(test.run_at).toLocaleString()}</p>
              </div>
            </div>
            {getStatusBadge(test.status)}
          </div>

          {test.score !== null && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Score</span>
                <span className="text-sm font-bold">{test.score}/100</span>
              </div>
              <Progress value={test.score} className="h-2" />
            </div>
          )}

          {test.error_message && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{test.error_message}</p>
            </div>
          )}

          {test.results && (
            <div className="mt-4">
              <details className="cursor-pointer">
                <summary className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  View Details
                </summary>
                <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto max-h-64">
                  {JSON.stringify(test.results, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
