"use client"

import { useInstallPrompt } from "@/lib/pwa/install-prompt"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X } from "lucide-react"
import { useState } from "react"

export function InstallPrompt() {
  const { isInstallable, promptInstall } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(false)

  if (!isInstallable || dismissed) return null

  return (
    <Card className="fixed bottom-20 left-4 right-4 z-40 md:hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">Install App</CardTitle>
            <CardDescription className="text-sm">Get the full experience with our mobile app</CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setDismissed(true)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Button onClick={promptInstall} className="w-full" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Install Now
        </Button>
      </CardContent>
    </Card>
  )
}
