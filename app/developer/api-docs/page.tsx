import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Code } from "lucide-react"

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">API Documentation</h1>
        <p className="text-muted-foreground">RESTful API for accessing Template Generation Academy data</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Authentication and base URL</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Base URL</h3>
            <code className="block bg-muted p-3 rounded-md">https://templategen.academy/api/v1</code>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Authentication</h3>
            <p className="text-sm text-muted-foreground mb-2">Include your API key in the request header:</p>
            <code className="block bg-muted p-3 rounded-md">x-api-key: your_api_key_here</code>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Rate Limits</h3>
            <p className="text-sm text-muted-foreground">Free tier: 100 requests/hour | Pro tier: 1000 requests/hour</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="generations">Generations</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>GET /templates</CardTitle>
                <Badge variant="secondary">Public</Badge>
              </div>
              <CardDescription>Retrieve a list of templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Query Parameters</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <code className="bg-muted px-2 py-1 rounded">page</code>
                    <span className="text-muted-foreground">Page number (default: 1)</span>
                  </div>
                  <div className="flex gap-2">
                    <code className="bg-muted px-2 py-1 rounded">limit</code>
                    <span className="text-muted-foreground">Results per page (max: 100)</span>
                  </div>
                  <div className="flex gap-2">
                    <code className="bg-muted px-2 py-1 rounded">category</code>
                    <span className="text-muted-foreground">Filter by category</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Example Request</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {`curl -X GET "https://templategen.academy/api/v1/templates?page=1&limit=10" \\
  -H "x-api-key: your_api_key_here"`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Example Response</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {`{
  "data": [
    {
      "id": "123",
      "name": "Modern Dashboard",
      "description": "A sleek dashboard template",
      "category": "dashboard",
      "average_score": 8.5,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>GET /templates/:id</CardTitle>
                <Badge variant="secondary">Public</Badge>
              </div>
              <CardDescription>Get a specific template by ID</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Example Request</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {`curl -X GET "https://templategen.academy/api/v1/templates/123" \\
  -H "x-api-key: your_api_key_here"`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>POST /generations</CardTitle>
                <Badge>Authenticated</Badge>
              </div>
              <CardDescription>Submit a new generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Request Body</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {`{
  "template_id": "123",
  "scores": {
    "code_quality": 8,
    "documentation": 7,
    "usability": 9,
    "innovation": 8,
    "performance": 7,
    "maintainability": 8
  },
  "feedback": "Excellent template with great documentation"
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>GET /users/:id</CardTitle>
                <Badge variant="secondary">Public</Badge>
              </div>
              <CardDescription>Get user profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Returns public profile data including username, bio, and statistics
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Events</CardTitle>
              <CardDescription>Subscribe to real-time events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Available Events</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <code className="bg-muted px-2 py-1 rounded">template.created</code>
                    <span className="text-muted-foreground">New template submitted</span>
                  </div>
                  <div className="flex gap-2">
                    <code className="bg-muted px-2 py-1 rounded">generation.completed</code>
                    <span className="text-muted-foreground">Generation finished</span>
                  </div>
                  <div className="flex gap-2">
                    <code className="bg-muted px-2 py-1 rounded">user.certified</code>
                    <span className="text-muted-foreground">User earned certification</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Webhook Payload Example</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {`{
  "event": "template.created",
  "timestamp": "2024-01-15T10:00:00Z",
  "data": {
    "template_id": "123",
    "name": "Modern Dashboard",
    "author_id": "456"
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            SDK Libraries
          </CardTitle>
          <CardDescription>Official client libraries for popular languages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">JavaScript / TypeScript</h4>
              <code className="text-sm bg-muted px-2 py-1 rounded">npm install @templategen/sdk</code>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Python</h4>
              <code className="text-sm bg-muted px-2 py-1 rounded">pip install templategen</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
