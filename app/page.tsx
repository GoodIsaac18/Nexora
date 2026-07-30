import Link from "next/link"
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react"
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
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex animate-fade-in-up items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              {tools.length}+ tools and counting
            </span>
            <h1 className="mt-6 animate-fade-in-up text-4xl font-bold tracking-tight text-balance [animation-delay:60ms] sm:text-6xl">
              Every little tool you need,{" "}
              <span className="text-primary">in one place</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl animate-fade-in-up text-lg leading-relaxed text-muted-foreground text-pretty [animation-delay:120ms]">
              {SITE.description}
            </p>
            <div className="mt-8 flex animate-fade-in-up flex-col items-center justify-center gap-3 [animation-delay:180ms] sm:flex-row">
              <Link
                href="#search"
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                Explore all tools
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/json-formatter"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
              >
                Try JSON Formatter
              </Link>
            </div>

            <ul className="mx-auto mt-10 flex max-w-lg animate-fade-in-up flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground [animation-delay:240ms]">
              <li className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" /> 100% private, runs locally
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Zap className="size-4 text-primary" /> No sign-up required
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AdSlot placement="home-leaderboard" className="mb-2" />
      </div>

      {/* Browse */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Browse the toolbox</h2>
          <p className="mt-1 text-muted-foreground">
            {availableCount} tools ready to use — search or filter by category.
          </p>
        </div>
        <ToolBrowser />
      </section>
    </>
  )
}
