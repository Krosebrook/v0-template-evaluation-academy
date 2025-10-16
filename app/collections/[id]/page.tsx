export const dynamic = "force-dynamic"

import { createServerClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, Globe, Lock, Plus, Edit } from "lucide-react"
import Link from "next/link"
import { TemplateCard } from "@/components/template-card"
import { FollowCollectionButton } from "@/components/follow-collection-button"

export default async function CollectionPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch collection
  const { data: collection } = await supabase
    .from("collections")
    .select(`
      *,
      profiles:user_id(username, avatar_url),
      collection_followers(count)
    `)
    .eq("id", params.id)
    .single()

  if (!collection) {
    notFound()
  }

  // Check if user can view this collection
  if (!collection.is_public && collection.user_id !== user?.id) {
    redirect("/collections")
  }

  // Fetch templates in collection
  const { data: collectionTemplates } = await supabase
    .from("collection_templates")
    .select(`
      *,
      templates(*)
    `)
    .eq("collection_id", params.id)
    .order("position", { ascending: true })

  const isOwner = user?.id === collection.user_id

  // Check if user is following
  let isFollowing = false
  if (user) {
    const { data: followData } = await supabase
      .from("collection_followers")
      .select("id")
      .eq("collection_id", params.id)
      .eq("user_id", user.id)
      .single()
    isFollowing = !!followData
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-8 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">{collection.name}</h1>
              {collection.is_public ? (
                <Badge variant="secondary">
                  <Globe className="mr-1 h-3 w-3" />
                  Public
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Lock className="mr-1 h-3 w-3" />
                  Private
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mb-4">{collection.description || "No description"}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {collection.view_count || 0} views
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {collection.collection_followers?.[0]?.count || 0} followers
              </div>
              <div>{collectionTemplates?.length || 0} templates</div>
            </div>
          </div>
          <div className="flex gap-2">
            {isOwner ? (
              <>
                <Link href={`/collections/${params.id}/edit`}>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Link href={`/collections/${params.id}/add`}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Templates
                  </Button>
                </Link>
              </>
            ) : user ? (
              <FollowCollectionButton collectionId={params.id} initialFollowing={isFollowing} />
            ) : null}
          </div>
        </div>
      </Card>

      {collectionTemplates && collectionTemplates.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collectionTemplates.map((item: any) => (
            <TemplateCard key={item.id} template={item.templates} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">No templates yet</h3>
          <p className="text-muted-foreground mb-6">
            {isOwner ? "Add templates to your collection" : "This collection is empty"}
          </p>
          {isOwner && (
            <Link href={`/collections/${params.id}/add`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Templates
              </Button>
            </Link>
          )}
        </Card>
      )}
    </div>
  )
}
