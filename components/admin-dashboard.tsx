"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, Star, TrendingUp, Search, Shield, Trash2, BarChart3 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface AdminDashboardProps {
  users: any[]
  templates: any[]
  evaluations: any[]
  currentUserId: string
}

export function AdminDashboard({ users, templates, evaluations, currentUserId }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const supabase = createClient()

  const stats = {
    totalUsers: users.length,
    totalTemplates: templates.length,
    totalEvaluations: evaluations.length,
    avgEvaluationsPerTemplate: templates.length > 0 ? (evaluations.length / templates.length).toFixed(1) : "0",
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || template.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

      if (error) throw error

      setMessage({ type: "success", text: "User role updated successfully" })
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to update role" })
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return

    try {
      const { error } = await supabase.from("templates").delete().eq("id", templateId)

      if (error) throw error

      setMessage({ type: "success", text: "Template deleted successfully" })
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to delete template" })
    }
  }

  const handleUpdateTemplateStatus = async (templateId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("templates").update({ status: newStatus }).eq("id", templateId)

      if (error) throw error

      setMessage({ type: "success", text: "Template status updated successfully" })
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to update status" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, templates, and system settings</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Templates</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalTemplates}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Evaluations</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalEvaluations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Evaluations</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.avgEvaluationsPerTemplate}</div>
              <p className="text-xs text-gray-500 mt-1">per template</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="evaluations" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Evaluations
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="evaluator">Evaluator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{user.display_name || "No name"}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : user.role === "evaluator" ? "secondary" : "outline"
                          }
                        >
                          {user.role}
                        </Badge>
                        {user.id !== currentUserId && (
                          <Select value={user.role} onValueChange={(value) => handleUpdateUserRole(user.id, value)}>
                            <SelectTrigger className="w-32">
                              <Shield className="h-4 w-4 mr-2" />
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="evaluator">Evaluator</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && <p className="text-center text-gray-500 py-8">No users found</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Template Management</CardTitle>
                <CardDescription>Review and manage submitted templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  {filteredTemplates.map((template) => (
                    <div key={template.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{template.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{template.description}</div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-500">
                            By {template.profiles?.display_name || template.profiles?.email || "Unknown"}
                          </span>
                          <Badge variant="outline">{template.category}</Badge>
                          <Badge variant="outline">{template.difficulty}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Link href={`/templates/results/${template.id}`}>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Select
                          value={template.status || "pending"}
                          onValueChange={(value) => handleUpdateTemplateStatus(template.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filteredTemplates.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No templates found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evaluations Tab */}
          <TabsContent value="evaluations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Overview</CardTitle>
                <CardDescription>View all submitted evaluations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {evaluations.slice(0, 20).map((evaluation) => (
                    <div key={evaluation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {evaluation.templates?.title || "Unknown Template"}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Evaluated by {evaluation.profiles?.display_name || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(evaluation.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600">
                            {typeof evaluation.overall_score === "number" ? evaluation.overall_score.toFixed(1) : "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">Overall Score</div>
                        </div>
                        <Link href={`/templates/results/${evaluation.template_id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {evaluations.length === 0 && <p className="text-center text-gray-500 py-8">No evaluations found</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
