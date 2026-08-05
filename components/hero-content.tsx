"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Sparkles, Zap, Clock, Users } from "lucide-react"

export function HeroContent() {
  const [scrollY, setScrollY] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener("change", handleMotionChange)
    return () => mediaQuery.removeEventListener("change", handleMotionChange)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Apply reduced motion or smooth scroll effect
  const opacity = Math.max(0, 1 - scrollY / 600)
  const translateY = reducedMotion ? 0 : scrollY * 0.3
  const scale = Math.max(0.9, 1 - scrollY / 2000)

  return (
    <div 
      className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:max-w-7xl lg:py-32 xl:py-40"
      style={{ 
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transition: reducedMotion ? 'none' : 'transform 0.05s ease-out, opacity 0.05s ease-out',
        willChange: 'transform, opacity'
      }}
    >
      <div className="mx-auto max-w-3xl text-center sm:max-w-4xl relative z-10">
        {/* Badge */}
        <div className="inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-4 py-2 text-sm font-semibold text-primary shadow-lg shadow-primary/10 backdrop-blur-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl hover:shadow-primary/20 lg:px-6 lg:py-2.5 motion-safe:hover:scale-105 motion-reduce:hover:scale-100">
          <Sparkles className="size-4 transition-transform duration-300 ease-out lg:size-5 motion-safe:group-hover:rotate-12" />
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">100+ tools and counting</span>
        </div>

        {/* Heading */}
        <h1 className="mt-8 animate-fade-in-up text-4xl font-extrabold tracking-tight text-balance [animation-delay:60ms] sm:text-5xl lg:text-7xl xl:text-8xl leading-tight">
          Every little tool you need,{" "}
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary/60 to-primary/60 blur-xl opacity-50 transition-opacity duration-500 ease-out" />
            <span className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/60 bg-clip-text text-transparent">in one place</span>
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-xl animate-fade-in-up text-lg leading-relaxed text-muted-foreground text-pretty [animation-delay:120ms] sm:max-w-2xl lg:text-xl">
          Access powerful tools instantly. No installation needed. Everything runs locally and securely right in your browser.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex animate-fade-in-up flex-col items-center justify-center gap-4 [animation-delay:180ms] sm:flex-row sm:gap-5 lg:mt-12 lg:gap-6">
          {/* Primary Button */}
          <Link
            href="#search"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-primary/80 px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-primary/40 active:scale-95 motion-safe:hover:scale-105 motion-reduce:active:scale-100 sm:h-14 sm:px-10 sm:text-base lg:h-16 lg:px-12 lg:text-lg"
          >
            Explore all tools
            <ArrowRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1 sm:size-5" />
          </Link>

          {/* Secondary Button */}
          <Link
            href="/json-formatter"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-primary/30 bg-background/60 px-8 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-300 ease-out hover:border-primary/60 hover:bg-primary/8 hover:shadow-lg hover:shadow-primary/15 active:scale-95 motion-safe:hover:scale-105 motion-reduce:active:scale-100 sm:h-14 sm:px-10 sm:text-base lg:h-16 lg:px-12 lg:text-lg"
          >
            <Zap className="size-4 text-primary transition-transform duration-300 ease-out group-hover:rotate-12 sm:size-5" />
            Try JSON Formatter
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="mx-auto mt-10 grid max-w-2xl animate-fade-in-up grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-6 lg:mt-16 [animation-delay:240ms]">
          {/* Card 1: Private */}
          <div className="group flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card/40 p-5 text-center transition-all duration-300 ease-out hover:border-primary/40 hover:bg-card/80 hover:shadow-xl hover:shadow-primary/10 motion-safe:hover:scale-105 motion-reduce:hover:scale-100 sm:p-6">
            <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary transition-all duration-300 ease-out group-hover:from-primary group-hover:to-primary/80 group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30 sm:size-14">
              <ShieldCheck className="size-6 transition-transform duration-300 ease-out group-hover:scale-110 sm:size-7" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-bold text-foreground transition-colors duration-300 sm:text-base">100% Private</span>
              <span className="text-xs text-muted-foreground transition-colors duration-300 sm:text-sm">Runs locally</span>
            </div>
          </div>

          {/* Card 2: No Sign-up */}
          <div className="group flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card/40 p-5 text-center transition-all duration-300 ease-out hover:border-primary/40 hover:bg-card/80 hover:shadow-xl hover:shadow-primary/10 motion-safe:hover:scale-105 motion-reduce:hover:scale-100 sm:p-6">
            <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary transition-all duration-300 ease-out group-hover:from-primary group-hover:to-primary/80 group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30 sm:size-14">
              <Users className="size-6 transition-transform duration-300 ease-out group-hover:scale-110 sm:size-7" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-bold text-foreground transition-colors duration-300 sm:text-base">No Sign-up</span>
              <span className="text-xs text-muted-foreground transition-colors duration-300 sm:text-sm">Required</span>
            </div>
          </div>

          {/* Card 3: Instant */}
          <div className="group flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card/40 p-5 text-center transition-all duration-300 ease-out hover:border-primary/40 hover:bg-card/80 hover:shadow-xl hover:shadow-primary/10 motion-safe:hover:scale-105 motion-reduce:hover:scale-100 sm:p-6">
            <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary transition-all duration-300 ease-out group-hover:from-primary group-hover:to-primary/80 group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30 sm:size-14">
              <Clock className="size-6 transition-transform duration-300 ease-out group-hover:scale-110 sm:size-7" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-bold text-foreground transition-colors duration-300 sm:text-base">Instant</span>
              <span className="text-xs text-muted-foreground transition-colors duration-300 sm:text-sm">Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
