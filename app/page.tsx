import Link from "next/link"
import { ArrowRight, ShieldCheck, Sparkles, Zap, TrendingUp, Users, Clock } from "lucide-react"
import { AdSlot } from "@/components/ad-slot"
import { availableTools, tools, SITE } from "@/lib/tools"
import { ToolBrowser } from "@/components/tool-browser"

export default function HomePage() {
  const availableCount = availableTools().length

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        {/* Animated background elements - only on large screens */}
        <div className="absolute inset-0 overflow-hidden hidden lg:block">
          <div className="absolute -top-40 -right-40 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl [animation-delay:1s]" />
        </div>
        
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:max-w-7xl lg:py-32 xl:py-40">
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
      </section>

      {/* Stats Section - only on large screens */}
      <section className="hidden border-b border-border bg-muted/30 lg:block">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:max-w-7xl lg:py-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="group rounded-2xl bg-card p-5 text-center shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:p-6">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground sm:mb-4 sm:size-16 sm:rounded-2xl">
                <TrendingUp className="size-6 sm:size-8" />
              </div>
              <p className="text-2xl font-bold sm:text-3xl">{tools.length}+</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Free Tools</p>
            </div>
            <div className="group rounded-2xl bg-card p-5 text-center shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:p-6">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground sm:mb-4 sm:size-16 sm:rounded-2xl">
                <Users className="size-6 sm:size-8" />
              </div>
              <p className="text-2xl font-bold sm:text-3xl">100%</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Privacy Focused</p>
            </div>
            <div className="group rounded-2xl bg-card p-5 text-center shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:p-6">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground sm:mb-4 sm:size-16 sm:rounded-2xl">
                <Clock className="size-6 sm:size-8" />
              </div>
              <p className="text-2xl font-bold sm:text-3xl">&lt;1s</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Response Time</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:max-w-7xl">
        <AdSlot placement="home-leaderboard" className="mb-2 sm:mb-4" />
      </div>

      {/* Browse */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:max-w-7xl lg:py-20">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Browse the toolbox</h2>
          <p className="mt-2 text-base text-muted-foreground sm:mt-4 sm:text-lg lg:text-xl">
            {availableCount} tools ready to use — search or filter by category.
          </p>
        </div>
        <ToolBrowser />
      </section>
    </>
  )
}
