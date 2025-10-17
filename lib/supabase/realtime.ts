"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "./client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export function useRealtimeTemplates() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    // Initial fetch
    const fetchTemplates = async () => {
      const { data } = await supabase
        .from("templates")
        .select("*, profiles:submitted_by(display_name, avatar_url)")
        .order("created_at", { ascending: false })

      if (data) {
        setTemplates(data)
      }
      setLoading(false)
    }

    fetchTemplates()

    // Subscribe to real-time changes
    const channel: RealtimeChannel = supabase
      .channel("templates-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "templates" }, (payload) => {
        console.log("[v0] New template inserted:", payload.new)
        setTemplates((current) => [payload.new as any, ...current])
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "templates" }, (payload) => {
        console.log("[v0] Template updated:", payload.new)
        setTemplates((current) => current.map((t) => (t.id === payload.new.id ? (payload.new as any) : t)))
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "templates" }, (payload) => {
        console.log("[v0] Template deleted:", payload.old)
        setTemplates((current) => current.filter((t) => t.id !== payload.old.id))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return { templates, loading }
}

export function useRealtimeGenerations(templateId: string) {
  const [generations, setGenerations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    // Initial fetch
    const fetchGenerations = async () => {
      const { data } = await supabase
        .from("evaluations")
        .select("*, profiles:evaluator_id(display_name, avatar_url)")
        .eq("template_id", templateId)
        .order("created_at", { ascending: false })

      if (data) {
        setGenerations(data)
      }
      setLoading(false)
    }

    fetchGenerations()

    // Subscribe to real-time changes
    const channel: RealtimeChannel = supabase
      .channel(`generations-${templateId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "evaluations",
          filter: `template_id=eq.${templateId}`,
        },
        (payload) => {
          console.log("[v0] New generation inserted:", payload.new)
          setGenerations((current) => [payload.new as any, ...current])
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "evaluations",
          filter: `template_id=eq.${templateId}`,
        },
        (payload) => {
          console.log("[v0] Generation updated:", payload.new)
          setGenerations((current) => current.map((g) => (g.id === payload.new.id ? (payload.new as any) : g)))
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [templateId, supabase])

  return { generations, loading }
}

export function useRealtimeNotifications(userId: string) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createBrowserClient()

  useEffect(() => {
    if (!userId) return

    // Initial fetch
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20)

      if (data) {
        setNotifications(data)
        setUnreadCount(data.filter((n) => !n.read).length)
      }
    }

    fetchNotifications()

    // Subscribe to real-time changes
    const channel: RealtimeChannel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("[v0] New notification:", payload.new)
          setNotifications((current) => [payload.new as any, ...current])
          setUnreadCount((count) => count + 1)
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("[v0] Notification updated:", payload.new)
          setNotifications((current) => current.map((n) => (n.id === payload.new.id ? (payload.new as any) : n)))
          if ((payload.new as any).read) {
            setUnreadCount((count) => Math.max(0, count - 1))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  const markAsRead = async (notificationId: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", notificationId)
  }

  const markAllAsRead = async () => {
    await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false)
    setUnreadCount(0)
  }

  return { notifications, unreadCount, markAsRead, markAllAsRead }
}

export function useOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const supabase = createBrowserClient()

  useEffect(() => {
    const channel: RealtimeChannel = supabase.channel("online-users", {
      config: {
        presence: {
          key: "user_id",
        },
      },
    })

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState()
        const users = Object.keys(state)
        console.log("[v0] Online users:", users)
        setOnlineUsers(users)
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (user) {
            await channel.track({ user_id: user.id, online_at: new Date().toISOString() })
          }
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return onlineUsers
}
