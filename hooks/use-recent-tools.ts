"use client"

import { useState, useEffect, useRef } from "react"
import { tools } from "@/lib/tools"

const RECENT_TOOLS_KEY = "recent-tools"
const MAX_RECENT_TOOLS = 6

export interface RecentTool {
  slug: string
  name: string
  timestamp: number
}

export function useRecentTools() {
  const [recentTools, setRecentTools] = useState<RecentTool[]>([])
  const lastAddedSlug = useRef<string | null>(null)

  useEffect(() => {
    // Load recent tools from localStorage
    try {
      const stored = localStorage.getItem(RECENT_TOOLS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as RecentTool[]
        setRecentTools(parsed)
      }
    } catch (error) {
      console.error("Failed to load recent tools:", error)
    }
  }, [])

  const addRecentTool = (slug: string) => {
    // Avoid adding the same tool repeatedly
    if (lastAddedSlug.current === slug) return
    
    const tool = tools.find(t => t.slug === slug)
    if (!tool) return

    // Check if tool is already at the top
    if (recentTools.length > 0 && recentTools[0].slug === slug) return

    lastAddedSlug.current = slug
    setRecentTools(prev => {
      const newRecent = [
        { slug: tool.slug, name: tool.name, timestamp: Date.now() },
        ...prev.filter(t => t.slug !== slug)
      ].slice(0, MAX_RECENT_TOOLS)

      try {
        localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(newRecent))
      } catch (error) {
        console.error("Failed to save recent tools:", error)
      }

      return newRecent
    })
  }

  const clearRecentTools = () => {
    setRecentTools([])
    try {
      localStorage.removeItem(RECENT_TOOLS_KEY)
    } catch (error) {
      console.error("Failed to clear recent tools:", error)
    }
  }

  return { recentTools, addRecentTool, clearRecentTools }
}
