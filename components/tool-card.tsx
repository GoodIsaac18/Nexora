"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowRight, Heart, Braces, KeyRound, Palette, FingerprintPattern, FileCode2, 
  Tags, Hash, Baseline, Type, Link2, Clock, Ruler, QrCode, Scan, Wifi, 
  ImageIcon, Lock, ScanText, MessageCircle, Minimize2, Megaphone, Download, 
  Video, Music, Play, Camera, Monitor, FileText, Unlock, Merge, Scissors, 
  Minimize, Languages, DollarSign, User, Briefcase, GraduationCap, Award, 
  Image, MessageSquare, Calculator, Sparkles, Shield
} from "lucide-react"
import { cn } from "@/lib/utils"

// Icon mapping for client component
const iconMap: Record<string, any> = {
  Braces, KeyRound, Palette, FingerprintPattern, FileCode2, Tags, Hash, Baseline, 
  Type, Link2, Clock, Ruler, QrCode, Scan, Wifi, ImageIcon, Lock, ScanText, 
  MessageCircle, Minimize2, Megaphone, Download, Video, Music, Play, Camera, 
  Monitor, FileText, Unlock, Merge, Scissors, Minimize, Languages, DollarSign, 
  User, Briefcase, GraduationCap, Award, Image, MessageSquare, Calculator, Sparkles, Shield
}

interface ToolCardProps {
  slug: string
  name: string
  description: string
  iconName: string
  available: boolean
  className?: string
}

export function ToolCard({ slug, name, description, iconName, available, className }: ToolCardProps) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)

  useEffect(() => {
    // Skip API calls if there was a previous error
    if (apiError) {
      setLoading(false)
      return
    }

    // Fetch current likes from analytics
    fetch(`/api/analytics/track?slug=${slug}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        if (data.data && data.data.length > 0) {
          setLikes(data.data[0].likes || 0)
        }
      })
      .catch(error => {
        console.error("Error fetching likes:", error)
        setLikes(0)
        setApiError(true) // Disable further API calls on error
      })
      .finally(() => setLoading(false))
  }, [slug, apiError])

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (liked) return
    
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action: "like" })
      })
      
      setLiked(true)
      setLikes(prev => prev + 1)
    } catch (error) {
      console.error("Error liking tool:", error)
    }
  }

  // Get icon component from the icon name
  const IconComponent = iconMap[iconName]
  
  const content = (
    <>
      <div className="flex items-start justify-between gap-3 lg:gap-4">
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 lg:size-14 lg:rounded-2xl lg:bg-gradient-to-br lg:from-accent lg:to-accent/80 lg:group-hover:from-primary lg:group-hover:to-primary/80 lg:group-hover:text-primary-foreground lg:group-hover:shadow-lg lg:group-hover:shadow-primary/30">
          {IconComponent ? <IconComponent className="size-5 lg:size-7" /> : <span className="text-xs">No icon</span>}
        </span>
        {available ? (
          <ArrowRight className="size-5 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-primary lg:size-6 lg:-translate-x-2" />
        ) : (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground lg:px-3 lg:py-1 lg:text-xs lg:font-semibold">
            Soon
          </span>
        )}
      </div>
      <h3 className="mt-4 font-semibold tracking-tight group-hover:text-primary transition-colors lg:mt-5 lg:text-lg lg:font-bold">{name || 'No name'}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors lg:mt-2">{description || 'No description'}</p>
      
      {/* Like button */}
      {available && (
        <button
          onClick={handleLike}
          className={cn(
            "mt-3 flex items-center gap-1.5 text-xs transition-colors lg:mt-4 lg:text-sm",
            liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
          )}
        >
          <Heart className={cn("size-3.5 lg:size-4", liked && "fill-current")} />
          <span>{loading ? "..." : likes > 0 ? likes : "Me gusta"}</span>
        </button>
      )}
      
      {/* Decorative gradient on hover - only on large screens */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:rounded-3xl" />
    </>
  )

  const base =
    "group relative flex flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-300 lg:rounded-3xl lg:border-2 lg:bg-card/80 lg:backdrop-blur-sm lg:p-6 lg:duration-500"

  if (!available) {
    return <div className={cn(base, "opacity-70 grayscale", className)}>{content}</div>
  }

  return (
    <Link
      href={`/${slug}`}
      className={cn(
        base,
        "hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hover:-translate-y-2 lg:hover:border-primary/50 lg:hover:shadow-2xl lg:hover:shadow-primary/20 lg:focus-visible:ring-4 lg:focus-visible:ring-primary/30 lg:active:scale-95 lg:active:translate-y-0",
        className,
      )}
    >
      {content}
    </Link>
  )
}
