import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TemplatePreview() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Template Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video rounded-lg bg-secondary flex items-center justify-center">
            <p className="text-muted-foreground">Template Preview Area</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="tech">Tech Stack</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 pt-4">
              <div>
                <h4 className="mb-2 font-semibold">Description</h4>
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  A Next.js App Router template configured with TypeScript and Tailwind CSS. Perfect for starting new
                  projects with modern best practices.
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">Use Cases</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Landing pages</li>
                  <li>Marketing websites</li>
                  <li>Small business sites</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="features" className="pt-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>TypeScript for type safety</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Tailwind CSS for styling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>App Router architecture</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Responsive design</span>
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="tech" className="pt-4">
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Framework:</span>
                  <span className="ml-2 text-muted-foreground">Next.js 15</span>
                </div>
                <div>
                  <span className="font-medium">Language:</span>
                  <span className="ml-2 text-muted-foreground">TypeScript</span>
                </div>
                <div>
                  <span className="font-medium">Styling:</span>
                  <span className="ml-2 text-muted-foreground">Tailwind CSS</span>
                </div>
                <div>
                  <span className="font-medium">Deployment:</span>
                  <span className="ml-2 text-muted-foreground">Vercel</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
