"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trophy, Medal, Award, TrendingUp, Users, Star, ArrowLeft, Crown, Target, Loader2 } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

type SortBy = "score" | "badges" | "completion"

interface LeaderboardEntry {
  id: string
  user_id: string
  score: number
  badges: number
  completed_modules: number
  completion_rate: number
  rank: number
  profile: {
    display_name: string
    avatar_url: string | null
  }
  isCurrentUser?: boolean
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortBy>("score")
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const supabase = createBrowserClient()

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)

      // Fetch leaderboard data
      const { data: leaderboardData, error } = await supabase
        .from("leaderboard")
        .select(`
          *,
          profile:profiles!leaderboard_user_id_fkey(display_name, avatar_url)
        `)
        .order("rank", { ascending: true })
        .limit(100)

      if (error) throw error

      // Transform data
      const transformedData = (leaderboardData || []).map((entry: any) => ({
        id: entry.id,
        user_id: entry.user_id,
        score: entry.score,
        badges: entry.badges,
        completed_modules: entry.completed_modules,
        completion_rate: entry.completion_rate,
        rank: entry.rank,
        profile: entry.profile || { display_name: "Anonymous", avatar_url: null },
        isCurrentUser: entry.user_id === user?.id,
      }))

      setLeaderboard(transformedData)
    } catch (error) {
      console.error("Error loading leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-white" />
          <p className="text-white">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score
    if (sortBy === "badges") return b.badges - a.badges
    if (sortBy === "completion") return b.completion_rate - a.completion_rate
    return 0
  })

  const currentUserEntry = sortedLeaderboard.find((entry) => entry.isCurrentUser)
  const userRank = currentUserEntry?.rank || 0
  const totalUsers = sortedLeaderboard.length
  const percentile = userRank > 0 ? Math.round(((totalUsers - userRank) / totalUsers) * 100) : 0

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />
    return <span className="text-lg font-bold text-white">#{rank}</span>
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-orange-400"
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-400"
    if (rank === 3) return "bg-gradient-to-r from-orange-400 to-red-400"
    if (rank <= 10) return "glass"
    return "glass"
  }

  return (
    <div className="min-h-screen gradient-mesh p-4">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-white/20 transition-all mb-6 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="glass rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-10 h-10 text-yellow-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
              <p className="text-white/70">See how you rank among other evaluators</p>
            </div>
          </div>

          {/* User Stats Card */}
          {currentUserEntry && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
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
                      <div className="text-2xl font-bold">{currentUserEntry.score}</div>
                      <div className="text-xs opacity-90">Points</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{currentUserEntry.badges}</div>
                      <div className="text-xs opacity-90">Badges</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{currentUserEntry.completion_rate}%</div>
                      <div className="text-xs opacity-90">Complete</div>
                    </div>
                  </div>
                </div>
              </div>

              {userRank > 1 && sortedLeaderboard[userRank - 2] && (
                <div className="bg-white/20 rounded-lg p-3 text-sm">
                  <p className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>
                      {sortedLeaderboard[userRank - 2].score - currentUserEntry.score} more points to reach rank #
                      {userRank - 1}
                    </span>
                  </p>
                </div>
              )}

              {userRank === 1 && (
                <div className="bg-white/20 rounded-lg p-3 text-sm flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  <span>You're at the top! Keep up the great work!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sort Controls */}
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5" />
              <span className="font-medium">Sort by:</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("score")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === "score" ? "bg-white text-black" : "glass text-white hover:bg-white/20"
                }`}
              >
                Total Score
              </button>
              <button
                onClick={() => setSortBy("badges")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === "badges" ? "bg-white text-black" : "glass text-white hover:bg-white/20"
                }`}
              >
                Badges
              </button>
              <button
                onClick={() => setSortBy("completion")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === "completion" ? "bg-white text-black" : "glass text-white hover:bg-white/20"
                }`}
              >
                Completion
              </button>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left p-4 font-semibold text-white">Rank</th>
                  <th className="text-left p-4 font-semibold text-white">User</th>
                  <th className="text-center p-4 font-semibold text-white">Score</th>
                  <th className="text-center p-4 font-semibold text-white">Badges</th>
                  <th className="text-center p-4 font-semibold text-white">Modules</th>
                  <th className="text-center p-4 font-semibold text-white">Completion</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaderboard.map((entry) => {
                  const initials = entry.profile.display_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)

                  return (
                    <tr
                      key={entry.id}
                      className={`border-b border-white/5 transition-colors ${
                        entry.isCurrentUser
                          ? "bg-blue-500/20"
                          : entry.rank <= 3
                            ? "bg-yellow-500/10 hover:bg-yellow-500/20"
                            : "hover:bg-white/5"
                      }`}
                    >
                      <td className="p-4">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getRankBadge(entry.rank)}`}
                        >
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-2">
                              {entry.profile.display_name}
                              {entry.isCurrentUser && (
                                <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full">You</span>
                              )}
                              {entry.rank === 1 && !entry.isCurrentUser && (
                                <Crown className="w-4 h-4 text-yellow-400" />
                              )}
                            </div>
                            {entry.rank <= 3 && !entry.isCurrentUser && (
                              <div className="text-xs text-white/60">
                                {entry.rank === 1 ? "Top Performer" : entry.rank === 2 ? "Runner Up" : "Third Place"}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="text-xl font-bold text-white">{entry.score}</div>
                        <div className="text-xs text-white/60">points</div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Award className="w-4 h-4 text-yellow-400" />
                          <span className="font-semibold text-white">{entry.badges}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="font-semibold text-white">{entry.completed_modules}/9</div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 bg-white/20 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                entry.completion_rate === 100
                                  ? "bg-green-400"
                                  : entry.completion_rate >= 50
                                    ? "bg-yellow-400"
                                    : "bg-white/40"
                              }`}
                              style={{ width: `${entry.completion_rate}%` }}
                            />
                          </div>
                          <span className="font-semibold text-white w-12 text-right">{entry.completion_rate}%</span>
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
          <div className="glass rounded-xl p-6">
            <Trophy className="w-8 h-8 text-yellow-400 mb-3" />
            <h3 className="font-bold text-white mb-2">Top 3 Rewards</h3>
            <p className="text-sm text-white/70">Finish in the top 3 to earn exclusive recognition!</p>
          </div>

          <div className="glass rounded-xl p-6">
            <TrendingUp className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="font-bold text-white mb-2">Climb the Ranks</h3>
            <p className="text-sm text-white/70">Complete evaluations and earn badges to improve your ranking!</p>
          </div>

          <div className="glass rounded-xl p-6">
            <Star className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="font-bold text-white mb-2">100% Club</h3>
            <p className="text-sm text-white/70">Join the elite group who completed the entire curriculum!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
