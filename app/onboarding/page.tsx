"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Sparkles, Target, User } from "lucide-react"

const INTERESTS = [
  "Web Development",
  "Mobile Apps",
  "AI/ML",
  "Data Science",
  "DevOps",
  "UI/UX Design",
  "Backend",
  "Frontend",
  "Full Stack",
  "Cloud Computing",
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Step 1: Role
  const [role, setRole] = useState("")

  // Step 2: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  // Step 3: Profile
  const [bio, setBio] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      await handleComplete()
    }
  }

  const handleSkip = () => {
    router.push("/browse")
  }

  const handleComplete = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      // Update profile with onboarding data
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          role,
          interests: selectedInterests,
          bio,
          experience_level: experienceLevel,
          onboarding_completed: true,
        })
        .eq("id", user.id)

      if (updateError) throw updateError

      // Track onboarding completion
      await supabase.from("onboarding_progress").insert([
        { user_id: user.id, step_completed: "role" },
        { user_id: user.id, step_completed: "interests" },
        { user_id: user.id, step_completed: "profile" },
      ])

      router.push("/onboarding/complete")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete onboarding")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to Template Generation Academy</h1>
          <p className="text-muted-foreground">Let's personalize your experience</p>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {step} of {totalSteps}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 1 && (
                <>
                  <User className="h-5 w-5" />
                  What's your role?
                </>
              )}
              {step === 2 && (
                <>
                  <Target className="h-5 w-5" />
                  What are you interested in?
                </>
              )}
              {step === 3 && (
                <>
                  <Sparkles className="h-5 w-5" />
                  Tell us about yourself
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Help us understand how you'll use the platform"}
              {step === 2 && "Select topics you want to explore"}
              {step === 3 && "Complete your profile"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="role">I am a...</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="template-creator">Template Creator</SelectItem>
                      <SelectItem value="template-user">Template User</SelectItem>
                      <SelectItem value="learner">Learner</SelectItem>
                      <SelectItem value="educator">Educator</SelectItem>
                      <SelectItem value="business">Business Owner</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Select your interests (choose at least 3)</Label>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => (
                      <Badge
                        key={interest}
                        variant={selectedInterests.includes(interest) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleInterest(interest)}
                      >
                        {selectedInterests.includes(interest) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger id="experienceLevel">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us a bit about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-between mt-6">
              <Button variant="ghost" onClick={handleSkip}>
                Skip for now
              </Button>
              <div className="flex gap-2">
                {step > 1 && (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={
                    isLoading ||
                    (step === 1 && !role) ||
                    (step === 2 && selectedInterests.length < 3) ||
                    (step === 3 && !experienceLevel)
                  }
                >
                  {isLoading ? "Saving..." : step === totalSteps ? "Complete" : "Next"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
