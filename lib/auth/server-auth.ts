/**
 * Server-side authentication utilities to reduce code duplication
 */

import { createClient } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Get authenticated user and Supabase client for server actions
 * @returns Object with supabase client and user, or error
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      supabase,
      user: null,
      error: "Not authenticated",
    }
  }

  return {
    supabase,
    user,
    error: null,
  }
}

/**
 * Type for the return value of getAuthenticatedUser
 */
export type AuthResult = Awaited<ReturnType<typeof getAuthenticatedUser>>
