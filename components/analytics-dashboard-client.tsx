"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  Activity,
  DollarSign,
  Download,
  Eye,
  Heart,
  Share2,
  Star,
  Calendar,
} from "lucide-react"
import { AnalyticsChart } from "@/components/analytics-chart"
import { TemplatePerformanceTable } from "@/components/template-performance-table"
import { toast } from "sonner"

interface AnalyticsDashboardClientProps {
  initialData: {
    totalViews: number
    totalGenerations: number
    totalEngagement: number
    creditsBalance: number
    templates: any[]
    analytics: any[]
    subscription: any
  }
}

export function AnalyticsDashboardClient({ initialData }: AnalyticsDashboardClientProps) {
  const [timeRange, setTimeRange] = useState("30")
  const [isExporting, setIsExporting] = useState(false)

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      // Simulate export
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Create CSV content
      const headers = ["Date", "Views", "Generations", "Shares", "Favorites"]
      const rows = initialData.analytics.map((a) => [
        a.date,
        a.views,
        a.generations,
        a.shares,
        a.favorites,
      ])
      
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n")
      
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `analytics-${Date.now()}.csv`
      a.click()
      
      toast.success("Analytics exported successfully")
    } catch (error) {
      toast.error("Failed to export analytics")
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("PDF export feature coming soon")
    } finally {
      setIsExporting(false)
    }
  }

  // Calculate metrics based on time range
  const filteredAnalytics = initialData.analytics.slice(0, parseInt(timeRange))
  const totalViews = filteredAnalytics.reduce((sum, a) => sum + (a.views || 0), 0)
  const totalGenerations = filteredAnalytics.reduce((sum, a) => sum + (a.generations || 0), 0)
  const totalShares = filteredAnalytics.reduce((sum, a) => sum + (a.shares || 0), 0)
  const totalFavorites = filteredAnalytics.reduce((sum, a) => sum + (a.favorites || 0), 0)

  // Calculate trends
  const previousPeriod = initialData.analytics.slice(parseInt(timeRange), parseInt(timeRange) * 2)
  const previousViews = previousPeriod.reduce((sum, a) => sum + (a.views || 0), 0)
  const viewsTrend = previousViews > 0 ? ((totalViews - previousViews) / previousViews) * 100 : 0

  const metricsCards = [
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      trend: viewsTrend,
      icon: Eye,
      color: "text-blue-500",
    },
    {
      title: "Generations",
      value: totalGenerations.toLocaleString(),
      icon: BarChart3,
      color: "text-purple-500",
    },
    {
      title: "Engagement",
      value: (totalShares + totalFavorites).toLocaleString(),
      description: `${totalShares} shares, ${totalFavorites} favorites`,
      icon: Heart,
      color: "text-pink-500",
    },
    {
      title: "Credits Balance",
      value: initialData.creditsBalance.toLocaleString(),
      description: initialData.subscription
        ? `${initialData.subscription.plan_name} plan`
        : "Free plan",
      icon: DollarSign,
      color: "text-green-500",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="60">Last 60 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        {metricsCards.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                {metric.trend !== undefined && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp
                      className={`h-3 w-3 ${metric.trend >= 0 ? "text-green-500" : "text-red-500"}`}
                    />
                    {metric.trend >= 0 ? "+" : ""}
                    {metric.trend.toFixed(1)}% from previous period
                  </p>
                )}
                {metric.description && (
                  <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Views & Generations Over Time</CardTitle>
              <CardDescription>
                Daily performance metrics for the last {timeRange} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsChart data={filteredAnalytics} type="views-generations" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>Shares, favorites, and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsChart data={filteredAnalytics} type="engagement" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Performance</CardTitle>
              <CardDescription>Individual template analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <TemplatePerformanceTable
                templates={initialData.templates}
                analytics={filteredAnalytics}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
