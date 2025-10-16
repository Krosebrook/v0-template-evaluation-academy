"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Twitter, Linkedin, Facebook, Share2, Check, QrCode } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SocialShareButtonsProps {
  templateId: string
  title: string
  description: string
  url: string
}

export function SocialShareButtons({ templateId, title, description, url }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const supabase = createBrowserClient()

  const trackShare = async (platform: string) => {
    await supabase.from("social_shares").insert({
      template_id: templateId,
      platform,
    })
  }

  const shareOnTwitter = () => {
    const text = `Check out ${title} on Template Evaluation Academy!`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, "_blank")
    trackShare("twitter")
  }

  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(linkedinUrl, "_blank")
    trackShare("linkedin")
  }

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, "_blank")
    trackShare("facebook")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    trackShare("copy")
    setTimeout(() => setCopied(false), 2000)
  }

  const embedCode = `<iframe src="${url}/embed" width="100%" height="600" frameborder="0"></iframe>`

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode)
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={shareOnTwitter}>
        <Twitter className="h-4 w-4 mr-2" />
        Twitter
      </Button>
      <Button variant="outline" size="sm" onClick={shareOnLinkedIn}>
        <Linkedin className="h-4 w-4 mr-2" />
        LinkedIn
      </Button>
      <Button variant="outline" size="sm" onClick={shareOnFacebook}>
        <Facebook className="h-4 w-4 mr-2" />
        Facebook
      </Button>
      <Button variant="outline" size="sm" onClick={copyToClipboard}>
        {copied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
        {copied ? "Copied!" : "Copy Link"}
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <QrCode className="h-4 w-4 mr-2" />
            Embed
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share & Embed</DialogTitle>
            <DialogDescription>Share this template or embed it on your website</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="embed">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="embed">Embed Code</TabsTrigger>
              <TabsTrigger value="qr">QR Code</TabsTrigger>
            </TabsList>

            <TabsContent value="embed" className="space-y-4">
              <div>
                <Label htmlFor="embed-code">Embed Code</Label>
                <div className="flex gap-2 mt-2">
                  <Input id="embed-code" value={embedCode} readOnly className="font-mono text-sm" />
                  <Button onClick={copyEmbedCode}>Copy</Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Copy and paste this code into your website to embed this template
                </p>
              </div>

              <div>
                <Label>Preview</Label>
                <div className="mt-2 border rounded-lg p-4 bg-muted">
                  <div className="aspect-video bg-background rounded flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Embed Preview</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="qr" className="space-y-4">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center mb-4">
                  <p className="text-sm text-muted-foreground">QR Code</p>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Scan this QR code to view the template on mobile devices
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
