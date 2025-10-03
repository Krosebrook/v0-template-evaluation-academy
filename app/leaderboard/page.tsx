"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trophy, Medal, Award, TrendingUp, Users, Star, ArrowLeft, Crown, Target } from "lucide-react"

const MOCK_LEADERBOARD = [
  {
    id: 1,
    name: "Alex Chen",
    score: 270,
    badges: 6,
    completedModules: 9,
    completionRate: 100,
    avatar: "AC",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    score: 260,
    badges: 6,
    completedModules: 9,
    completionRate: 100,
    avatar: "SJ",
  },
  {
    id: 3,
    name: "Michael Park",
    score: 240,
    badges: 5,
    completedModules: 8,
    completionRate: 89,
    avatar: "MP",
  },
  {
    id: 4,
    name: "Emma Davis",
    score: 210,
    badges: 5,
    completedModules: 7,
    completionRate: 78,
    avatar: "ED",
  },
  {
    id: 5,
    name: "James Wilson",
    score: 180,
    badges: 4,
    completedModules: 6,
    completionRate: 67,
    avatar: "JW",
  },
  {
    id: 6,
    name: "Olivia Martinez",
    score: 150,
    badges: 4,
    completedModules: 5,
    completionRate: 56,
    avatar: "OM",
  },
  {
    id: 7,
    name: "Daniel Lee",
    score: 120,
    badges: 3,
    completedModules: 4,
    completionRate: 44,
    avatar: "DL",
  },
  {
    id: 8,
    name: "Sophia Brown",
    score: 90,
    badges: 3,
    completedModules: 3,
    completionRate: 33,
    avatar: "SB",
  },
  {
    id: 9,
    name: "Ryan Taylor",
    score: 60,
    badges: 2,
    completedModules: 2,
    completionRate: 22,
    avatar: "RT",
  },
  {
    id: 10,
    name: "Isabella Garcia",
    score: 30,
    badges: 1,
    completedModules: 1,
    completionRate: 11,
    avatar: "IG",
  },
]

type SortBy = "score" | "badges" | "completion"

export default function LeaderboardPage() {
  const [progress, setProgress] = useState<any>(null)
  const [sortBy, setSortBy] = useState<SortBy>("score")
  const [userName, setUserName] = useState("You")

  useEffect(() => {
    const saved = localStorage.getItem("template-academy-progress")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setProgress(data)
      } catch (e) {
        console.error("Failed to load progress")
      }
    }

    const savedName = localStorage.getItem("template-academy-username")
    if (savedName) {
      setUserName(savedName)
    }
  }, [])

  if (!progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  const userStats = {
    score: progress.score,
    badges: progress.badges.length,
    completedModules: progress.completedModules.length,
    completionRate: Math.round((progress.completedModules.length / 9) * 100),
  }

  const allUsers = [
    ...MOCK_LEADERBOARD,
    {
      id: "user",
      name: userName,
      score: userStats.score,
      badges: userStats.badges,
      completedModules: userStats.completedModules,
      completionRate: userStats.completionRate,
      avatar:
        userName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "YO",
      isCurrentUser: true,
    },
  ]

  const sortedUsers = [...allUsers].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score
    if (sortBy === "badges") return b.badges - a.badges
    if (sortBy === "completion") return b.completionRate - a.completionRate
    return 0
  })

  const userRank = sortedUsers.findIndex((u) => u.id === "user") + 1
  const totalUsers = sortedUsers.length
  const percentile = Math.round(((totalUsers - userRank) / totalUsers) * 100)

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-400 text-white"
    if (rank === 3) return "bg-gradient-to-r from-orange-400 to-red-400 text-white"
    if (rank <= 10) return "bg-indigo-100 text-indigo-700"
    return "bg-gray-100 text-gray-700"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Academy
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-yellow-500" />
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Leaderboard</h1>
              <p className="text-gray-600">See how you rank among other learners</p>
            </div>
          </div>

          {/* User Stats Card */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-90">Your Rank</p>
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-bold">#{userRank}</span>
                  <div className="text-left">
                    <p className="text-sm opacity-90">out of {totalUsers}</p>
                    <p className="text-xs opacity-75">Top {100 - percentile}%</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{userStats.score}</div>
                    <div className="text-xs opacity-90">Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{userStats.badges}</div>
                    <div className="text-xs opacity-90">Badges</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{userStats.completionRate}%</div>
                    <div className="text-xs opacity-90">Complete</div>
                  </div>
                </div>
              </div>
            </div>

            {userRank > 1 && (
              <div className="bg-white bg-opacity-20 rounded-lg p-3 text-sm">
                <p className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>
                    {sortedUsers[userRank - 2].score - userStats.score} more points to reach rank #{userRank - 1}
                  </span>
                </p>
              </div>
            )}

            {userRank === 1 && (
              <div className="bg-white bg-opacity-20 rounded-lg p-3 text-sm flex items-center gap-2">
                <Crown className="w-4 h-4" />
                <span>You're at the top! Keep up the great work!</span>
              </div>
            )}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span className="font-medium">Sort by:</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("score")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === "score"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Total Score
              </button>
              <button
                onClick={() => setSortBy("badges")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === "badges"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Badges Earned
              </button>
              <button
                onClick={() => setSortBy("completion")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === "completion"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Completion Rate
              </button>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Rank</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Learner</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Score</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Badges</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Modules</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Completion</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user, index) => {
                  const rank = index + 1
                  const isCurrentUser = user.id === "user"

                  return (
                    <tr
                      key={user.id}
                      className={`border-b transition-colors ${
                        isCurrentUser
                          ? "bg-indigo-50 border-indigo-200"
                          : rank <= 3
                            ? "bg-yellow-50 hover:bg-yellow-100"
                            : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="p-4">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getRankBadge(rank)}`}
                        >
                          {getRankIcon(rank)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {user.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 flex items-center gap-2">
                              {user.name}
                              {isCurrentUser && (
                                <span className="text-xs px-2 py-1 bg-indigo-600 text-white rounded-full">You</span>
                              )}
                              {rank === 1 && !isCurrentUser && <Crown className="w-4 h-4 text-yellow-500" />}
                            </div>
                            {rank <= 3 && !isCurrentUser && (
                              <div className="text-xs text-gray-500">
                                {rank === 1 ? "Top Performer" : rank === 2 ? "Runner Up" : "Third Place"}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="text-xl font-bold text-indigo-600">{user.score}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Award className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold text-gray-800">{user.badges}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="font-semibold text-gray-800">{user.completedModules}/9</div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                user.completionRate === 100
                                  ? "bg-green-500"
                                  : user.completionRate >= 50
                                    ? "bg-yellow-500"
                                    : "bg-gray-400"
                              }`}
                              style={{ width: `${user.completionRate}%` }}
                            />
                          </div>
                          <span className="font-semibold text-gray-800 w-12 text-right">{user.completionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Motivational Section */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
            <Trophy className="w-8 h-8 text-yellow-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Top 3 Rewards</h3>
            <p className="text-sm text-gray-600">
              Finish in the top 3 to earn exclusive recognition and bragging rights!
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
            <TrendingUp className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Climb the Ranks</h3>
            <p className="text-sm text-gray-600">Complete more modules and earn badges to improve your ranking!</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
            <Star className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">100% Club</h3>
            <p className="text-sm text-gray-600">
              Join the elite group of learners who completed the entire curriculum!
            </p>
          </div>
        </div>

        {/* Note about mock data */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This leaderboard includes sample data for demonstration. Your actual rank is
            calculated based on your progress compared to other learners.
          </p>
        </div>
      </div>
    </div>
  )
}
