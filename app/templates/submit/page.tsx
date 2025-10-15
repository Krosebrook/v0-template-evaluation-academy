import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TemplateSubmissionForm } from "@/components/template-submission-form"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SubmitTemplatePage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/templates/submit")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-8">
          <Link href="/templates">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Gallery
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
            Submit a Template
          </h1>
          <p className="text-lg text-muted-foreground">Share your template with the community for evaluation</p>
        </div>

        <TemplateSubmissionForm userId={user.id} />
      </div>
    </main>
  )
}
