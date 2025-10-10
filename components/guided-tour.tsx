"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ArrowRight, ArrowLeft, Check } from "lucide-react"

interface TourStep {
  target: string
  title: string
  content: string
  position: "top" | "bottom" | "left" | "right"
  action?: string
}

interface GuidedTourProps {
  tourId: string
  steps: TourStep[]
  onComplete?: () => void
}

export function GuidedTour({ tourId, steps, onComplete }: GuidedTourProps) {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasCompletedTour, setHasCompletedTour] = useState(false)

  useEffect(() => {
    const completed = localStorage.getItem(`tour-completed-${tourId}`)
    if (completed) {
      setHasCompletedTour(true)
    } else {
      // Auto-start tour after a short delay
      const timer = setTimeout(() => {
        setIsActive(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [tourId])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTour()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeTour = () => {
    localStorage.setItem(`tour-completed-${tourId}`, "true")
    setHasCompletedTour(true)
    setIsActive(false)
    onComplete?.()
  }

  const skipTour = () => {
    setIsActive(false)
  }

  const restartTour = () => {
    setCurrentStep(0)
    setIsActive(true)
  }

  if (!isActive || hasCompletedTour) {
    return hasCompletedTour ? (
      <Button variant="outline" size="sm" onClick={restartTour} className="fixed bottom-4 right-4 z-50 bg-transparent">
        Restart Tour
      </Button>
    ) : null
  }

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 pointer-events-none" />
      <Card className="fixed bottom-4 right-4 z-50 w-96 p-6 shadow-2xl border-2 border-primary">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <h3 className="font-semibold text-lg">{step.title}</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={skipTour} className="h-6 w-6 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{step.content}</p>

          {step.action && (
            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
              <p className="text-xs font-medium text-primary">{step.action}</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={handlePrevious} disabled={currentStep === 0}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button onClick={handleNext} size="sm">
              {currentStep === steps.length - 1 ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </>
  )
}
