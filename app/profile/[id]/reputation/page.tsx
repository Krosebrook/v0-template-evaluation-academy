export const dynamic = "force-dynamic"

import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, TrendingUp, Award, Star, Calendar } from "lucide-react"

export default async function UserReputationPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createServerClient()

  // Fetch user reputation
  const { data: reputation } = await supabase
    .from("user_reputation")
    .select(`
      *,
      profiles:user_id(username, avatar_url)
    `)
    .eq("user_id", params.id)
    .single()

  if (!reputation) {
    notFound()
  }

  // Fetch reputation history
  const { data: history } = await supabase
    .from("reputation_history")
    .select("*")
    .eq("user_id", params.id)
    .order("created_at", { ascending: false })
    .limit(20)

  // Fetch user achievements
  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select(`
      *,
      achievements(*)
    `)
    .eq("user_id", params.id)
    .order("earned_at", { ascending: false })

  // Fetch trust scores
  const { data: trustScores } = await supabase.from("user_trust_scores").select("*").eq("user_id", params.id).single()

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

  const nextLevelThreshold =
    reputation.level === "Bronze"
      ? 200
      : reputation.level === "Silver"
        ? 500
        : reputation.level === "Gold"
          ? 1000
          : 1000
  const progressToNextLevel = (reputation.total_score / nextLevelThreshold) * 100

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <Card className="p-8 mb-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold">
            {reputation.profiles?.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{reputation.profiles?.username}</h1>
            <Badge className={`${getLevelColor(reputation.level)} text-lg px-4 py-1`}>{reputation.level} Member</Badge>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Total Reputation</p>
            <p className="text-4xl font-bold">{reputation.total_score}</p>
          </div>
        </div>

        {/* Progress to Next Level */}
        {reputation.level !== "Platinum" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">
                Progress to{" "}
                {reputation.level === "Bronze" ? "Silver" : reputation.level === "Silver" ? "Gold" : "Platinum"}
              </p>
              <p className="text-sm text-muted-foreground">
                {reputation.total_score} / {nextLevelThreshold}
              </p>
            </div>
            <Progress value={Math.min(progressToNextLevel, 100)} className="h-3" />
          </div>
        )}
      </Card>

      {/* Score Breakdown */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Reputation Breakdown</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Star className="h-6 w-6 text-yellow-500" />
              <div className="flex-1">
                <p className="font-medium">Evaluation Quality</p>
                <p className="text-sm text-muted-foreground">40% weight</p>
              </div>
              <p className="text-2xl font-bold">{reputation.evaluation_quality_score}</p>
            </div>
            <Progress value={(reputation.evaluation_quality_score / reputation.total_score) * 100} className="h-2" />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="h-6 w-6 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium">Template Submissions</p>
                <p className="text-sm text-muted-foreground">30% weight</p>
              </div>
              <p className="text-2xl font-bold">{reputation.template_submission_score}</p>
            </div>
            <Progress value={(reputation.template_submission_score / reputation.total_score) * 100} className="h-2" />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <Award className="h-6 w-6 text-green-500" />
              <div className="flex-1">
                <p className="font-medium">Community Contributions</p>
                <p className="text-sm text-muted-foreground">20% weight</p>
              </div>
              <p className="text-2xl font-bold">{reputation.community_contribution_score}</p>
            </div>
            <Progress
              value={(reputation.community_contribution_score / reputation.total_score) * 100}
              className="h-2"
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-6 w-6 text-purple-500" />
              <div className="flex-1">
                <p className="font-medium">Consistency</p>
                <p className="text-sm text-muted-foreground">10% weight</p>
              </div>
              <p className="text-2xl font-bold">{reputation.consistency_score}</p>
            </div>
            <Progress value={(reputation.consistency_score / reputation.total_score) * 100} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Trust Scores */}
      {trustScores && (
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Trust Scores</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Accuracy</p>
              <Progress value={Number(trustScores.accuracy_score)} className="h-3 mb-1" />
              <p className="text-right text-sm font-medium">{trustScores.accuracy_score}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Reliability</p>
              <Progress value={Number(trustScores.reliability_score)} className="h-3 mb-1" />
              <p className="text-right text-sm font-medium">{trustScores.reliability_score}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Helpfulness</p>
              <Progress value={Number(trustScores.helpfulness_score)} className="h-3 mb-1" />
              <p className="text-right text-sm font-medium">{trustScores.helpfulness_score}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Overall Trust</p>
              <Progress value={Number(trustScores.overall_trust_score)} className="h-3 mb-1" />
              <p className="text-right text-sm font-medium">{trustScores.overall_trust_score}%</p>
            </div>
          </div>
        </Card>
      )}

      {/* Achievements */}
      {userAchievements && userAchievements.length > 0 && (
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Achievements</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {userAchievements.map((ua: any) => (
              <div key={ua.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="text-4xl">{ua.achievements.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold">{ua.achievements.name}</p>
                  <p className="text-sm text-muted-foreground">{ua.achievements.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Earned {new Date(ua.earned_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Activity */}
      {history && history.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {history.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <Badge variant={item.points_change > 0 ? "default" : "secondary"}>
                  {item.points_change > 0 ? "+" : ""}
                  {item.points_change} pts
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
