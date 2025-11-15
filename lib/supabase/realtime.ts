"use client"

import { useEffect, useState, useMemo } from "react"
import { createBrowserClient } from "./client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export function useRealtimeTemplates() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // Memoize Supabase client to prevent recreation on every render
  const supabase = useMemo(() => createBrowserClient(), [])

  useEffect(() => {
    // Initial fetch
    const fetchTemplates = async () => {
      const { data } = await supabase
        .from("templates")
        .select("*, profiles(display_name, avatar_url)")
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
        setTemplates((current) => [payload.new as any, ...current])
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "templates" }, (payload) => {
        // Optimized: Use findIndex for single operation instead of map
        setTemplates((current) => {
          const index = current.findIndex((t) => t.id === payload.new.id)
          if (index === -1) return current
          const updated = [...current]
          updated[index] = payload.new as any
          return updated
        })
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "templates" }, (payload) => {
        setTemplates((current) => current.filter((t) => t.id !== payload.old.id))
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return { templates, loading }
}

export function useRealtimeGenerations(templateId: string) {
  const [generations, setGenerations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // Memoize Supabase client to prevent recreation on every render
  const supabase = useMemo(() => createBrowserClient(), [])

  useEffect(() => {
    // Initial fetch
    const fetchGenerations = async () => {
      const { data } = await supabase
        .from("evaluations")
        .select("*, evaluator:profiles!evaluations_evaluator_id_fkey(display_name, avatar_url)")
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
          // Optimized: Use findIndex for single operation instead of map
          setGenerations((current) => {
            const index = current.findIndex((g) => g.id === payload.new.id)
            if (index === -1) return current
            const updated = [...current]
            updated[index] = payload.new as any
            return updated
          })
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [templateId, supabase])

  return { generations, loading }
}

export function useRealtimeNotifications(userId: string) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  // Memoize Supabase client to prevent recreation on every render
  const supabase = useMemo(() => createBrowserClient(), [])

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
          // Optimized: Use findIndex for single operation instead of map
          setNotifications((current) => {
            const index = current.findIndex((n) => n.id === payload.new.id)
            if (index === -1) return current
            const updated = [...current]
            updated[index] = payload.new as any
            return updated
          })
          if ((payload.new as any).read) {
            setUnreadCount((count) => Math.max(0, count - 1))
          }
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
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
  // Memoize Supabase client to prevent recreation on every render
  const supabase = useMemo(() => createBrowserClient(), [])

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
      channel.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return onlineUsers
}
