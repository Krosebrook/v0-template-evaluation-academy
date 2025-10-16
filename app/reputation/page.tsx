export const dynamic = "force-dynamic"

import { createServerClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, Award, Star } from "lucide-react"
import Link from "next/link"

export default async function ReputationLeaderboardPage() {
  const supabase = await createServerClient()

  // Fetch top users by reputation
  const { data: topUsers } = await supabase
    .from("user_reputation")
    .select(`
      *,
      profiles:user_id(username, avatar_url)
    `)
    .order("total_score", { ascending: false })
    .limit(50)

  // Update ranks
  topUsers?.forEach((user, index) => {
    user.rank = index + 1
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Platinum":
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-white"
      case "Gold":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case "Silver":
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
      default:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Platinum":
        return "💎"
      case "Gold":
        return "🏆"
      case "Silver":
        return "🥈"
      default:
        return "🥉"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Reputation Leaderboard</h1>
        <p className="text-xl text-muted-foreground">Top contributors to the Template Evaluation Academy</p>
      </div>

      {/* Level Explanation */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Reputation Levels</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="text-4xl mb-2">🥉</div>
            <h3 className="font-semibold mb-1">Bronze</h3>
            <p className="text-sm text-muted-foreground">0-199 points</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🥈</div>
            <h3 className="font-semibold mb-1">Silver</h3>
            <p className="text-sm text-muted-foreground">200-499 points</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="font-semibold mb-1">Gold</h3>
            <p className="text-sm text-muted-foreground">500-999 points</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">💎</div>
            <h3 className="font-semibold mb-1">Platinum</h3>
            <p className="text-sm text-muted-foreground">1000+ points</p>
          </div>
        </div>
      </Card>

      {/* Leaderboard */}
      <div className="space-y-3">
        {topUsers?.map((user: any) => (
          <Card key={user.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-6">
              {/* Rank */}
              <div className="flex-shrink-0 w-16 text-center">
                {user.rank <= 3 ? (
                  <div className="text-4xl">
                    {user.rank === 1 && "🥇"}
                    {user.rank === 2 && "🥈"}
                    {user.rank === 3 && "🥉"}
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-muted-foreground">#{user.rank}</div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold">
                    {user.profiles?.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <Link href={`/profile/${user.user_id}`}>
                      <h3 className="text-xl font-semibold hover:underline">{user.profiles?.username}</h3>
                    </Link>
                    <Badge className={getLevelColor(user.level)}>
                      {getLevelIcon(user.level)} {user.level}
                    </Badge>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Evaluation Quality</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">{user.evaluation_quality_score}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Templates</p>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold">{user.template_submission_score}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Community</p>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-500" />
                      <span className="font-semibold">{user.community_contribution_score}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Consistency</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                      <span className="font-semibold">{user.consistency_score}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Score */}
              <div className="flex-shrink-0 text-right">
                <p className="text-sm text-muted-foreground mb-1">Total Score</p>
                <p className="text-3xl font-bold">{user.total_score}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
