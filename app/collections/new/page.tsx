export const dynamic = "force-dynamic"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CollectionForm } from "@/components/collection-form"

export default async function NewCollectionPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-2">Create Collection</h1>
      <p className="text-muted-foreground mb-8">Organize your favorite templates into a curated collection</p>

      <CollectionForm />
    </div>
  )
}
