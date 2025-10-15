import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ApiKeyManager } from "@/components/api-key-manager"
import { WebhookManager } from "@/components/webhook-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = "force-dynamic"

export default async function DeveloperPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: apiKeys } = await supabase
    .from("api_keys")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: webhooks } = await supabase
    .from("webhooks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Developer Portal</h1>
        <p className="text-muted-foreground">Manage API keys, webhooks, and integrations</p>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys">
          <ApiKeyManager apiKeys={apiKeys || []} userId={user.id} />
        </TabsContent>

        <TabsContent value="webhooks">
          <WebhookManager webhooks={webhooks || []} userId={user.id} />
        </TabsContent>

        <TabsContent value="docs">
          <div className="prose max-w-none">
            <h2>API Documentation</h2>
            <p>Access the Template Evaluation Academy API to integrate with your applications.</p>

            <h3>Authentication</h3>
            <p>Include your API key in the request header:</p>
            <pre className="bg-muted p-4 rounded-md">
              <code>x-api-key: your_api_key_here</code>
            </pre>

            <h3>Endpoints</h3>

            <h4>GET /api/v1/templates</h4>
            <p>List all approved templates with pagination.</p>
            <p>Query parameters:</p>
            <ul>
              <li>
                <code>page</code> - Page number (default: 1)
              </li>
              <li>
                <code>limit</code> - Items per page (default: 10, max: 100)
              </li>
              <li>
                <code>category</code> - Filter by category
              </li>
            </ul>

            <h4>GET /api/v1/templates/:id</h4>
            <p>Get a specific template by ID with evaluation data.</p>

            <h3>Rate Limits</h3>
            <p>API requests are limited to 1000 requests per hour per API key.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
