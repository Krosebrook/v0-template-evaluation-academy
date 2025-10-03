"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { User, Trophy, Target, TrendingUp, Award, BookOpen, CheckCircle, Clock, ArrowLeft, Star } from "lucide-react"
import { ShareButton } from "@/components/share-button"

const TIERS = ["novice", "intermediate", "advanced"]

const TIER_COLORS = {
  novice: { bg: "bg-green-50", border: "border-green-300", text: "text-green-700" },
  intermediate: { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-700" },
  advanced: { bg: "bg-red-50", border: "border-red-300", text: "text-red-700" },
}

const BADGES = [
  {
    id: "first-steps",
    name: "First Steps",
    icon: "🎯",
    description: "Complete your first module",
  },
  {
    id: "template-hunter",
    name: "Template Hunter",
    icon: "🔍",
    description: "Complete 2+ novice modules",
  },
  {
    id: "security-conscious",
    name: "Security Conscious",
    icon: "🛡️",
    description: "Master security evaluation",
  },
  {
    id: "master-evaluator",
    name: "Master Evaluator",
    icon: "⚖️",
    description: "Complete all intermediate modules",
  },
  {
    id: "production-ready",
    name: "Production Ready",
    icon: "🚀",
    description: "Master production deployment",
  },
  {
    id: "completionist",
    name: "Template Master",
    icon: "🏆",
    description: "Complete entire curriculum",
  },
]

export default function ProfilePage() {
  const [progress, setProgress] = useState<any>(null)
  const [stats, setStats] = useState({
    totalModules: 9,
    completedModules: 0,
    totalPoints: 0,
    badgesEarned: 0,
    currentStreak: 0,
    completionRate: 0,
    averageScore: 0,
  })

  useEffect(() => {
    const saved = localStorage.getItem("template-academy-progress")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setProgress(data)

        // Calculate stats
        const completedModules = data.completedModules.length
        const completionRate = Math.round((completedModules / 9) * 100)

        setStats({
          totalModules: 9,
          completedModules,
          totalPoints: data.score,
          badgesEarned: data.badges.length,
          currentStreak: calculateStreak(data),
          completionRate,
          averageScore: completedModules > 0 ? Math.round(data.score / completedModules) : 0,
        })
      } catch (e) {
        console.error("Failed to load progress")
      }
    }
  }, [])

  const calculateStreak = (data: any) => {
    // Simple streak calculation - in real app would use timestamps
    return data.completedModules.length > 0 ? Math.min(data.completedModules.length, 7) : 0
  }

  const getTierProgress = (tier: string) => {
    if (!progress) return { completed: 0, total: 3 }
    const completed = progress.completedModules.filter((m: string) => m.startsWith(tier)).length
    return { completed, total: 3 }
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const isCompleted = stats.completionRate === 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Academy
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-1">Your Learning Profile</h1>
                  <p className="text-gray-600">Track your progress and achievements</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {stats.totalPoints}
                </div>
                <div className="text-sm text-gray-600 font-medium">Total Points</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Share Your Progress</h3>
                <ShareButton
                  title="My Template Academy Progress"
                  text={`I've completed ${stats.completedModules} modules and earned ${stats.badgesEarned} badges at Template Evaluation Academy! Total score: ${stats.totalPoints} points. 🎓`}
                  variant="default"
                />
              </div>
            </div>

            {isCompleted && (
              <div className="mt-6 pt-6 border-t">
                <Link
                  href="/certificate"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-500 transition-all shadow-lg"
                >
                  <Award className="w-5 h-5" />
                  View Your Certificate
                </Link>
              </div>
            )}

            <div className="mt-4">
              <Link
                href="/leaderboard"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all"
              >
                <Trophy className="w-5 h-5" />
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-800">{stats.completedModules}</span>
            </div>
            <div className="text-sm text-gray-600">Modules Completed</div>
            <div className="text-xs text-gray-500 mt-1">of {stats.totalModules} total</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl font-bold text-gray-800">{stats.badgesEarned}</span>
            </div>
            <div className="text-sm text-gray-600">Badges Earned</div>
            <div className="text-xs text-gray-500 mt-1">of {BADGES.length} available</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-800">{stats.completionRate}%</span>
            </div>
            <div className="text-sm text-gray-600">Completion Rate</div>
            <div className="text-xs text-gray-500 mt-1">Overall progress</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-800">{stats.averageScore}</span>
            </div>
            <div className="text-sm text-gray-600">Avg Points/Module</div>
            <div className="text-xs text-gray-500 mt-1">Performance metric</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Progress by Tier */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              Progress by Tier
            </h2>

            <div className="space-y-6">
              {TIERS.map((tier) => {
                const tierProgress = getTierProgress(tier)
                const percentage = Math.round((tierProgress.completed / tierProgress.total) * 100)
                const colors = TIER_COLORS[tier as keyof typeof TIER_COLORS]

                return (
                  <div key={tier}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700 capitalize">{tier}</span>
                      <span className="text-sm text-gray-600">
                        {tierProgress.completed}/{tierProgress.total} modules
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          tier === "novice" ? "bg-green-500" : tier === "intermediate" ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {tierProgress.completed === tierProgress.total && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Tier completed!
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Recent Activity */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Recent Activity
              </h3>
              <div className="space-y-2">
                {progress.completedModules
                  .slice(-5)
                  .reverse()
                  .map((moduleId: string, idx: number) => {
                    const [tier, module] = moduleId.split("-")
                    return (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 capitalize">
                            {module.replace(/([A-Z])/g, " $1").trim()}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">{tier} tier</div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            tier === "novice"
                              ? "bg-green-100 text-green-700"
                              : tier === "intermediate"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          +{tier === "novice" ? 10 : tier === "intermediate" ? 20 : 30} pts
                        </span>
                      </div>
                    )
                  })}
                {progress.completedModules.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No completed modules yet. Start learning!</p>
                )}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-600" />
              Achievements
            </h2>

            <div className="space-y-3">
              {BADGES.map((badge) => {
                const earned = progress.badges.includes(badge.id)
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      earned
                        ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300"
                        : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{earned ? badge.icon : "🔒"}</span>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800">{earned ? badge.name : "Locked"}</div>
                        <div className="text-xs text-gray-600 mt-1">{badge.description}</div>
                      </div>
                      {earned && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Next Badge */}
            {stats.badgesEarned < BADGES.length && (
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-indigo-600" />
                  <span className="font-bold text-indigo-900">Next Badge</span>
                </div>
                <p className="text-sm text-indigo-700">Complete more modules to unlock your next achievement!</p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        {stats.completionRate < 100 && (
          <div className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Keep Learning!</h3>
            <p className="mb-4 opacity-90">
              You're {stats.completionRate}% through the curriculum. Complete {9 - stats.completedModules} more modules
              to become a Template Master!
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Continue Learning
            </Link>
          </div>
        )}

        {stats.completionRate === 100 && (
          <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg p-8 text-white text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">Congratulations, Template Master!</h3>
            <p className="text-lg opacity-90 mb-6">
              You've completed the entire curriculum and earned all {BADGES.length} badges!
            </p>
            <Link
              href="/certificate"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg shadow-lg"
            >
              <Award className="w-6 h-6" />
              View Your Certificate
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
