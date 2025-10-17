"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, User, Mail, Shield, Bell } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({
    display_name: "",
    role: "user",
  })
  const [emailPreferences, setEmailPreferences] = useState({
    evaluation_notifications: true,
    comment_notifications: true,
    weekly_digest: true,
    generation_complete: true,
    marketplace_sales: true,
    team_invitations: true,
    version_updates: true,
    marketing_emails: false,
    digest_frequency: "weekly" as "instant" | "daily" | "weekly" | "never",
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push("/auth/login?redirect=/profile/settings")
        return
      }

      setUser(authUser)

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

      if (profileData) {
        setProfile({
          display_name: profileData.display_name || "",
          role: profileData.role || "user",
        })
      }

      const { data: prefsData } = await supabase
        .from("email_preferences")
        .select("*")
        .eq("user_id", authUser.id)
        .single()

      if (prefsData) {
        setEmailPreferences({
          evaluation_notifications: prefsData.evaluation_notifications ?? true,
          comment_notifications: prefsData.comment_notifications ?? true,
          weekly_digest: prefsData.weekly_digest ?? true,
          generation_complete: prefsData.generation_complete ?? true,
          marketplace_sales: prefsData.marketplace_sales ?? true,
          team_invitations: prefsData.team_invitations ?? true,
          version_updates: prefsData.version_updates ?? true,
          marketing_emails: prefsData.marketing_emails ?? false,
          digest_frequency: prefsData.digest_frequency || "weekly",
        })
      } else {
        await supabase.from("email_preferences").insert({
          user_id: authUser.id,
          evaluation_notifications: true,
          comment_notifications: true,
          weekly_digest: true,
          generation_complete: true,
          marketplace_sales: true,
          team_invitations: true,
          version_updates: true,
          marketing_emails: false,
          digest_frequency: "weekly",
        })
      }

      setLoading(false)
    }

    loadProfile()
  }, [supabase, router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: profile.display_name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setMessage({ type: "success", text: "Profile updated successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to update profile" })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveEmailPreferences = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase.from("email_preferences").upsert({
        user_id: user.id,
        ...emailPreferences,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      setMessage({ type: "success", text: "Email preferences updated successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to update preferences" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        <div className="grid gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={profile.display_name}
                    onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user?.email || ""} disabled className="bg-gray-50" />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={profile.role} disabled>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="evaluator">Evaluator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">Contact an admin to change your role</p>
                </div>

                {message && (
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <Button type="submit" disabled={saving} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>Manage your email notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Activity Notifications */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Activity Notifications</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="generation-complete">Generation Complete</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails when your template generation is complete
                    </p>
                  </div>
                  <Switch
                    id="generation-complete"
                    checked={emailPreferences.generation_complete}
                    onCheckedChange={(checked) =>
                      setEmailPreferences({ ...emailPreferences, generation_complete: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="evaluation-notifications">Evaluation Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive emails when your templates are evaluated</p>
                  </div>
                  <Switch
                    id="evaluation-notifications"
                    checked={emailPreferences.evaluation_notifications}
                    onCheckedChange={(checked) =>
                      setEmailPreferences({ ...emailPreferences, evaluation_notifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="comment-notifications">Comment Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails when someone comments on your templates
                    </p>
                  </div>
                  <Switch
                    id="comment-notifications"
                    checked={emailPreferences.comment_notifications}
                    onCheckedChange={(checked) =>
                      setEmailPreferences({ ...emailPreferences, comment_notifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="version-updates">Version Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified when templates you follow are updated</p>
                  </div>
                  <Switch
                    id="version-updates"
                    checked={emailPreferences.version_updates}
                    onCheckedChange={(checked) =>
                      setEmailPreferences({ ...emailPreferences, version_updates: checked })
                    }
                  />
                </div>
              </div>

              {/* Marketplace Notifications */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-sm">Marketplace Notifications</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketplace-sales">Marketplace Sales</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails when someone purchases your templates
                    </p>
                  </div>
                  <Switch
                    id="marketplace-sales"
                    checked={emailPreferences.marketplace_sales}
                    onCheckedChange={(checked) =>
                      setEmailPreferences({ ...emailPreferences, marketplace_sales: checked })
                    }
                  />
                </div>
              </div>

              {/* Team Notifications */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-sm">Team Notifications</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="team-invitations">Team Invitations</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails when you're invited to join a workspace
                    </p>
                  </div>
                  <Switch
                    id="team-invitations"
                    checked={emailPreferences.team_invitations}
                    onCheckedChange={(checked) =>
                      setEmailPreferences({ ...emailPreferences, team_invitations: checked })
                    }
                  />
                </div>
              </div>

              {/* Digest Settings */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-sm">Digest Settings</h3>

                <div className="space-y-2">
                  <Label htmlFor="digest-frequency">Digest Frequency</Label>
                  <Select
                    value={emailPreferences.digest_frequency}
                    onValueChange={(value: any) =>
                      setEmailPreferences({ ...emailPreferences, digest_frequency: value })
                    }
                  >
                    <SelectTrigger id="digest-frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Instant (as they happen)</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Digest</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose how often you want to receive activity summaries
                  </p>
                </div>
              </div>

              {/* Marketing */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-sm">Marketing Communications</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features, tips, and special offers
                    </p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={emailPreferences.marketing_emails}
                    onCheckedChange={(checked) =>
                      setEmailPreferences({ ...emailPreferences, marketing_emails: checked })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveEmailPreferences} disabled={saving} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription>View your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-gray-600">User ID</span>
                <span className="text-sm font-mono text-gray-800">{user?.id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-gray-600">Account Created</span>
                <span className="text-sm text-gray-800">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Email Confirmed</span>
                <span className="text-sm text-gray-800">{user?.email_confirmed_at ? "Yes" : "No"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full bg-transparent" disabled>
                Change Password
              </Button>
              <p className="text-xs text-gray-500 text-center">Password reset functionality coming soon</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
