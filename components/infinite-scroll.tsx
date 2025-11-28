"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"

interface InfiniteScrollProps<T> {
  loadMore: (page: number) => Promise<T[]>
  renderItem: (item: T, index: number) => React.ReactNode
  initialData?: T[]
  hasMore?: boolean
  loader?: React.ReactNode
  endMessage?: React.ReactNode
}

export function InfiniteScroll<T>({
  loadMore,
  renderItem,
  initialData = [],
  hasMore = true,
  loader = <div className="py-8 text-center">Loading...</div>,
  endMessage = <div className="py-8 text-center text-muted-foreground">No more items</div>,
}: InfiniteScrollProps<T>) {
  const [items, setItems] = useState<T[]>(initialData)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMoreItems, setHasMoreItems] = useState(hasMore)
  const observerTarget = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const loadMoreItems = useCallback(async () => {
    setLoading(true)
    try {
      const newItems = await loadMore(page + 1)
      if (newItems.length === 0) {
        setHasMoreItems(false)
      } else {
        setItems((prev) => [...prev, ...newItems])
        setPage((prev) => prev + 1)
      }
    } catch (error) {
      console.error("[v0] Infinite scroll error:", error)
    } finally {
      setLoading(false)
    }
  }, [loadMore, page])

  useEffect(() => {
    // Reuse observer instance instead of recreating it
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMoreItems && !loading) {
            loadMoreItems()
          }
        },
        { threshold: 0.1 },
      )
    }

    const currentTarget = observerTarget.current
    if (currentTarget && observerRef.current) {
      observerRef.current.observe(currentTarget)
    }

    return () => {
      if (currentTarget && observerRef.current) {
        observerRef.current.unobserve(currentTarget)
      }
    }
  }, [hasMoreItems, loading, loadMoreItems])

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [])

  return (
    <div>
      {items.map((item, index) => renderItem(item, index))}
      <div ref={observerTarget}>{loading ? loader : !hasMoreItems ? endMessage : null}</div>
    </div>
  )
}
