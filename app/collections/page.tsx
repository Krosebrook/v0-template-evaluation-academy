export const dynamic = "force-dynamic"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Lock, Globe, Eye, Heart } from "lucide-react"
import Link from "next/link"

interface Collection {
  id: string
  name: string
  description: string | null
  is_public: boolean
  view_count: number
  collection_templates: Array<{ count: number }>
  collection_followers: Array<{ count: number }>
}

export default async function CollectionsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user's collections
  const { data: collections } = await supabase
    .from("collections")
    .select(`
      *,
      collection_templates(count),
      collection_followers(count)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Collections</h1>
          <p className="text-muted-foreground">Organize and share your favorite templates</p>
        </div>
        <Link href="/collections/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Collection
          </Button>
        </Link>
      </div>

      {collections && collections.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection: Collection) => (
            <Link key={collection.id} href={`/collections/${collection.id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{collection.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {collection.description || "No description"}
                    </p>
                  </div>
                  {collection.is_public ? (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {collection.view_count || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {collection.collection_followers?.[0]?.count || 0}
                  </div>
                  <div>{collection.collection_templates?.[0]?.count || 0} templates</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">No collections yet</h3>
          <p className="text-muted-foreground mb-6">Create your first collection to organize templates</p>
          <Link href="/collections/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Collection
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
