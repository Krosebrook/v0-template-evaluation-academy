"use client"

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { AnalyticsData } from "@/types/analytics"

interface AnalyticsChartProps {
  data: AnalyticsData[]
  type: "views-generations" | "engagement"
}

export function AnalyticsChart({ data, type }: AnalyticsChartProps) {
  // Transform data for charts
  const chartData = data
    .slice()
    .reverse()
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: item.views || 0,
      generations: item.generations || 0,
      shares: item.shares || 0,
      favorites: item.favorites || 0,
      engagement: (item.shares || 0) + (item.favorites || 0),
    }))

  if (type === "views-generations") {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="date" 
            className="text-xs"
            tick={{ fill: "currentColor" }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fill: "currentColor" }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px"
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="views" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="generations" 
            stroke="hsl(var(--chart-2))" 
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  if (type === "engagement") {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="date" 
            className="text-xs"
            tick={{ fill: "currentColor" }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fill: "currentColor" }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px"
            }}
          />
          <Legend />
          <Bar 
            dataKey="shares" 
            fill="hsl(var(--chart-1))" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="favorites" 
            fill="hsl(var(--chart-2))" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return null
}
