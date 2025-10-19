"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BookOpen,
  Video,
  FileText,
  Wrench,
  Layout,
  Search,
  Heart,
  Bookmark,
  Eye,
  Clock,
  Star,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Resource {
  id: string
  title: string
  description: string
  category: string
  type: string
  url: string
  tags: string[]
  difficulty: string
  duration: number
  views: number
  likes: number
  bookmarks: number
  featured: boolean
  author: {
    display_name: string
    avatar_url: string | null
  }
  isLiked?: boolean
  isBookmarked?: boolean
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const supabase = createBrowserClient()

  useEffect(() => {
    loadResources()
  }, [])

  const loadResources = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Fetch resources with author info
      const { data: resourcesData, error } = await supabase
        .from("resources")
        .select(`
          *,
          author:profiles!resources_author_id_fkey(display_name, avatar_url)
        `)
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) throw error

      // Fetch user's likes and bookmarks if logged in
      let userLikes: string[] = []
      let userBookmarks: string[] = []

      if (user) {
        const [likesRes, bookmarksRes] = await Promise.all([
          supabase.from("resource_likes").select("resource_id").eq("user_id", user.id),
          supabase.from("resource_bookmarks").select("resource_id").eq("user_id", user.id),
        ])

        userLikes = likesRes.data?.map((l) => l.resource_id) || []
        userBookmarks = bookmarksRes.data?.map((b) => b.resource_id) || []
      }

      const transformedData = (resourcesData || []).map((resource: any) => ({
        ...resource,
        author: resource.author || { display_name: "Anonymous", avatar_url: null },
        isLiked: userLikes.includes(resource.id),
        isBookmarked: userBookmarks.includes(resource.id),
      }))

      setResources(transformedData)
    } catch (error) {
      console.error("Error loading resources:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleLike = async (resourceId: string) => {
    const resource = resources.find((r) => r.id === resourceId)
    if (!resource) return

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      if (resource.isLiked) {
        await supabase.from("resource_likes").delete().match({ user_id: user.id, resource_id: resourceId })
        setResources(resources.map((r) => (r.id === resourceId ? { ...r, likes: r.likes - 1, isLiked: false } : r)))
      } else {
        await supabase.from("resource_likes").insert({ user_id: user.id, resource_id: resourceId })
        setResources(resources.map((r) => (r.id === resourceId ? { ...r, likes: r.likes + 1, isLiked: true } : r)))
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const toggleBookmark = async (resourceId: string) => {
    const resource = resources.find((r) => r.id === resourceId)
    if (!resource) return

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      if (resource.isBookmarked) {
        await supabase.from("resource_bookmarks").delete().match({ user_id: user.id, resource_id: resourceId })
        setResources(
          resources.map((r) => (r.id === resourceId ? { ...r, bookmarks: r.bookmarks - 1, isBookmarked: false } : r)),
        )
      } else {
        await supabase.from("resource_bookmarks").insert({ user_id: user.id, resource_id: resourceId })
        setResources(
          resources.map((r) => (r.id === resourceId ? { ...r, bookmarks: r.bookmarks + 1, isBookmarked: true } : r)),
        )
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    const matchesType = selectedType === "all" || resource.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

  const categories = ["all", ...Array.from(new Set(resources.map((r) => r.category)))]
  const types = ["all", "article", "video", "tutorial", "tool", "template"]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="w-5 h-5" />
      case "video":
        return <Video className="w-5 h-5" />
      case "tutorial":
        return <BookOpen className="w-5 h-5" />
      case "tool":
        return <Wrench className="w-5 h-5" />
      case "template":
        return <Layout className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "advanced":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-white" />
          <p className="text-white">Loading resources...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-mesh p-4">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-white/20 transition-all mb-6 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="glass rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-blue-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">Resources Library</h1>
              <p className="text-white/70">Curated resources to help you master template evaluation</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass border-white/10 text-white placeholder:text-white/50"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 glass rounded-lg text-white border-white/10"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-black">
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 glass rounded-lg text-white border-white/10"
              >
                {types.map((type) => (
                  <option key={type} value={type} className="bg-black">
                    {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Resources */}
        {filteredResources.some((r) => r.featured) && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Featured Resources
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {filteredResources
                .filter((r) => r.featured)
                .map((resource) => (
                  <div key={resource.id} className="glass rounded-xl p-6 hover:bg-white/10 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/20 rounded-lg">{getTypeIcon(resource.type)}</div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{resource.title}</h3>
                          <p className="text-sm text-white/60">{resource.category}</p>
                        </div>
                      </div>
                      <Badge className={getDifficultyColor(resource.difficulty)}>{resource.difficulty}</Badge>
                    </div>
                    <p className="text-white/70 mb-4">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {resource.duration}min
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {resource.views}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLike(resource.id)}
                          className={resource.isLiked ? "text-red-400" : "text-white/60"}
                        >
                          <Heart className={`w-4 h-4 ${resource.isLiked ? "fill-current" : ""}`} />
                          {resource.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(resource.id)}
                          className={resource.isBookmarked ? "text-blue-400" : "text-white/60"}
                        >
                          <Bookmark className={`w-4 h-4 ${resource.isBookmarked ? "fill-current" : ""}`} />
                          {resource.bookmarks}
                        </Button>
                        <Button asChild>
                          <Link href={resource.url}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* All Resources */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">All Resources ({filteredResources.length})</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources
              .filter((r) => !r.featured)
              .map((resource) => (
                <div key={resource.id} className="glass rounded-xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">{getTypeIcon(resource.type)}</div>
                    <Badge className={getDifficultyColor(resource.difficulty)}>{resource.difficulty}</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{resource.title}</h3>
                  <p className="text-sm text-white/70 mb-4 line-clamp-2">{resource.description}</p>
                  <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {resource.duration}min
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {resource.views}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(resource.id)}
                        className={resource.isLiked ? "text-red-400" : "text-white/60"}
                      >
                        <Heart className={`w-4 h-4 ${resource.isLiked ? "fill-current" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(resource.id)}
                        className={resource.isBookmarked ? "text-blue-400" : "text-white/60"}
                      >
                        <Bookmark className={`w-4 h-4 ${resource.isBookmarked ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                    <Button size="sm" asChild>
                      <Link href={resource.url}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
