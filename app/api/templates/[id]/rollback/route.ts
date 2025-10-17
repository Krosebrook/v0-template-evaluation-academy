import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const versionId = formData.get("versionId") as string

    // Fetch the version to restore
    const { data: version, error: versionError } = await supabase
      .from("template_versions")
      .select("*")
      .eq("id", versionId)
      .single()

    if (versionError || !version) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 })
    }

    // Check if user owns the template
    const { data: template } = await supabase.from("templates").select("author_id").eq("id", params.id).single()

    if (template?.author_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update all versions to not be current
    await supabase.from("template_versions").update({ is_current: false }).eq("template_id", params.id)

    // Set this version as current
    await supabase.from("template_versions").update({ is_current: true }).eq("id", versionId)

    // Update template with version content
    await supabase
      .from("templates")
      .update({
        name: version.title,
        description: version.description,
        content: version.content,
        current_version: version.version_number,
      })
      .eq("id", params.id)

    revalidatePath(`/templates/${params.id}`)
    revalidatePath(`/templates/${params.id}/versions`)

    return NextResponse.redirect(new URL(`/templates/${params.id}/versions`, request.url))
  } catch (error) {
    return NextResponse.json({ error: "Failed to rollback version" }, { status: 500 })
  }
}
