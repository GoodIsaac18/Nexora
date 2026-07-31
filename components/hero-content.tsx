"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Sparkles, Zap, Clock } from "lucide-react"
import { tools, SITE } from "@/lib/tools"

export function HeroContent() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const opacity = Math.max(0, 1 - scrollY / 600)
  const translateY = scrollY * 0.3
  const scale = Math.max(0.9, 1 - scrollY / 2000)

  return (
    <div 
      className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:max-w-7xl lg:py-32 xl:py-40"
      style={{ 
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transition: 'transform 0.05s linear, opacity 0.05s linear',
        willChange: 'transform, opacity'
      }}
    >
      <div className="mx-auto max-w-3xl text-center sm:max-w-4xl">
        <span className="inline-flex animate-fade-in-up items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm transition-all hover:bg-card/80 hover:scale-105 lg:px-4 lg:py-2 lg:bg-card/50 lg:backdrop-blur-sm lg:shadow-lg">
          <Sparkles className="size-3.5 text-primary lg:size-4 lg:animate-spin-slow" />
          {tools.length}+ tools and counting
        </span>
        <h1 className="mt-6 animate-fade-in-up text-4xl font-bold tracking-tight text-balance [animation-delay:60ms] sm:text-5xl lg:text-7xl xl:text-8xl">
          Every little tool you need,{" "}
          <span className="text-primary sm:bg-gradient-to-r sm:from-primary sm:to-primary/60 sm:bg-clip-text sm:text-transparent">in one place</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl animate-fade-in-up text-lg leading-relaxed text-muted-foreground text-pretty [animation-delay:120ms] sm:max-w-2xl lg:text-xl">
          {SITE.description}
        </p>
        <div className="mt-8 flex animate-fade-in-up flex-col items-center justify-center gap-3 [animation-delay:180ms] sm:flex-row sm:gap-4 lg:mt-10 lg:gap-6">
          <Link
            href="#search"
            className="group inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-95 sm:h-12 sm:px-8 sm:text-base lg:h-14 lg:px-10 lg:hover:scale-105 lg:hover:shadow-xl lg:hover:shadow-primary/30"
          >
            Explore all tools
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 sm:size-5" />
          </Link>
          <Link
            href="/json-formatter"
            className="group inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted active:scale-95 sm:h-12 sm:px-8 sm:text-base lg:h-14 lg:px-10 lg:border-2 lg:bg-background/50 lg:backdrop-blur-sm lg:hover:border-primary/50 lg:hover:scale-105"
          >
            Try JSON Formatter
          </Link>
        </div>

        <ul className="mx-auto mt-8 flex max-w-lg animate-fade-in-up flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground [animation-delay:240ms] sm:mt-10 sm:max-w-2xl sm:gap-x-8 sm:gap-y-4 sm:text-base lg:mt-12">
          <li className="inline-flex items-center gap-1.5 transition-transform hover:scale-105 sm:gap-2">
            <ShieldCheck className="size-4 text-primary sm:size-5" /> 100% private, runs locally
          </li>
          <li className="inline-flex items-center gap-1.5 transition-transform hover:scale-105 sm:gap-2">
            <Zap className="size-4 text-primary sm:size-5" /> No sign-up required
          </li>
          <li className="inline-flex items-center gap-1.5 transition-transform hover:scale-105 sm:gap-2">
            <Clock className="size-4 text-primary sm:size-5" /> Instant results
          </li>
        </ul>
      </div>
    </div>
  )
}
