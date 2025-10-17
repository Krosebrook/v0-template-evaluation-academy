// Redis caching for frequently accessed data
const CACHE_TTL = {
  TEMPLATES: 300, // 5 minutes
  PROFILES: 600, // 10 minutes
  LEADERBOARD: 180, // 3 minutes
  STATS: 120, // 2 minutes
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    // In production, use Upstash Redis or similar
    // For now, use in-memory cache
    const cached = globalThis.__cache?.get(key)
    if (cached && cached.expires > Date.now()) {
      console.log("[v0] Cache hit:", key)
      return cached.data as T
    }
    return null
  } catch (error) {
    console.error("[v0] Cache get error:", error)
    return null
  }
}

export async function setCachedData<T>(key: string, data: T, ttl: number): Promise<void> {
  try {
    if (!globalThis.__cache) {
      globalThis.__cache = new Map()
    }
    globalThis.__cache.set(key, {
      data,
      expires: Date.now() + ttl * 1000,
    })
    console.log("[v0] Cache set:", key)
  } catch (error) {
    console.error("[v0] Cache set error:", error)
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  try {
    if (!globalThis.__cache) return
    const keys = Array.from(globalThis.__cache.keys())
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        globalThis.__cache.delete(key)
        console.log("[v0] Cache invalidated:", key)
      }
    })
  } catch (error) {
    console.error("[v0] Cache invalidate error:", error)
  }
}

declare global {
  var __cache: Map<string, { data: unknown; expires: number }> | undefined
}
