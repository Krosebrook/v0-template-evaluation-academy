"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { createBrowserClient } from "./client"
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js"

interface RealtimeTemplate {
  id: string
  title?: string
  description?: string
  content?: string
  category?: string
  tags?: string[]
  author_id?: string
  submitted_by?: string
  created_at?: string
  updated_at?: string
  status?: string
  views?: number
  generations?: number
  average_score?: number
  profiles?: {
    display_name?: string
    avatar_url?: string
  } | null
}

interface RealtimeGeneration {
  id: string
  template_id?: string
  user_id?: string
  overall_score?: number
  criteria_scores?: Record<string, number>
  feedback?: string
  created_at?: string
  status?: string
  evaluator?: {
    display_name?: string
    avatar_url?: string
  } | null
}

interface RealtimeNotification {
  id: string
  user_id?: string
  type?: string
  title?: string
  message?: string
  read?: boolean
  created_at?: string
  action_url?: string
}

export function useRealtimeTemplates() {
  const [templates, setTemplates] = useState<RealtimeTemplate[]>([])
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
        setTemplates(data as RealtimeTemplate[])
      }
      setLoading(false)
    }

    fetchTemplates()

    // Subscribe to real-time changes
    const channel: RealtimeChannel = supabase
      .channel("templates-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "templates" }, (payload: RealtimePostgresChangesPayload<RealtimeTemplate>) => {
        setTemplates((current) => [payload.new as RealtimeTemplate, ...current])
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "templates" }, (payload: RealtimePostgresChangesPayload<RealtimeTemplate>) => {
        // Optimized: Use findIndex for single operation instead of map
        setTemplates((current) => {
          const index = current.findIndex((t) => t.id === (payload.new as RealtimeTemplate).id)
          if (index === -1) return current
          const updated = [...current]
          updated[index] = payload.new as RealtimeTemplate
          return updated
        })
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "templates" }, (payload: RealtimePostgresChangesPayload<RealtimeTemplate>) => {
        setTemplates((current) => current.filter((t) => t.id !== (payload.old as RealtimeTemplate).id))
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
  const [generations, setGenerations] = useState<RealtimeGeneration[]>([])
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
        setGenerations(data as RealtimeGeneration[])
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
        (payload: RealtimePostgresChangesPayload<RealtimeGeneration>) => {
          setGenerations((current) => [payload.new as RealtimeGeneration, ...current])
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
        (payload: RealtimePostgresChangesPayload<RealtimeGeneration>) => {
          // Optimized: Use findIndex for single operation instead of map
          setGenerations((current) => {
            const index = current.findIndex((g) => g.id === (payload.new as RealtimeGeneration).id)
            if (index === -1) return current
            const updated = [...current]
            updated[index] = payload.new as RealtimeGeneration
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
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([])
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
        setNotifications(data as RealtimeNotification[])
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
        (payload: RealtimePostgresChangesPayload<RealtimeNotification>) => {
          setNotifications((current) => [payload.new as RealtimeNotification, ...current])
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
        (payload: RealtimePostgresChangesPayload<RealtimeNotification>) => {
          // Optimized: Use findIndex for single operation instead of map
          setNotifications((current) => {
            const newNotification = payload.new as RealtimeNotification
            const index = current.findIndex((n) => n.id === newNotification.id)
            if (index === -1) return current
            const updated = [...current]
            updated[index] = newNotification
            return updated
          })
          if ((payload.new as RealtimeNotification).read) {
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

  const markAsRead = useCallback(async (notificationId: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", notificationId)
  }, [supabase])

  const markAllAsRead = useCallback(async () => {
    await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false)
    setUnreadCount(0)
  }, [supabase, userId])

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
