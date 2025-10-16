import { createServerClient } from "@/lib/supabase/server"
import { RecommendedTemplates } from "@/components/recommended-templates"
import { Card } from "@/components/ui/card"
import { Sparkles, TrendingUp, Users } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function RecommendationsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Recommended for You</h1>
        <p className="text-muted-foreground">
          {user
            ? "Personalized template recommendations based on your activity"
            : "Trending templates in the community"}
        </p>
      </div>

      {/* Recommendation Categories */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">For You</h3>
          </div>
          <p className="text-sm text-muted-foreground">Templates matched to your interests and browsing history</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Trending</h3>
          </div>
          <p className="text-sm text-muted-foreground">Most popular templates in the last 7 days</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Similar Users</h3>
          </div>
          <p className="text-sm text-muted-foreground">Templates liked by users with similar tastes</p>
        </Card>
      </div>

      {/* Recommended Templates */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Recommended Templates</h2>
        <RecommendedTemplates userId={user?.id} />
      </div>
    </div>
  )
}
