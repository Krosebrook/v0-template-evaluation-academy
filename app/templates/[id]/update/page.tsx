import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TemplateUpdateForm } from "@/components/template-update-form"

export default async function UpdateTemplatePage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: template } = await supabase.from("templates").select("*").eq("id", params.id).single()

  if (!template) {
    redirect("/templates")
  }

  if (template.user_id !== user.id) {
    redirect("/templates")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Update Template</h1>
        <TemplateUpdateForm template={template} />
      </div>
    </div>
  )
}
