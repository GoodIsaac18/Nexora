import Link from "next/link"
import { ArrowRight, ShieldCheck, Sparkles, Zap, TrendingUp, Users, Clock } from "lucide-react"
import { AdSlot } from "@/components/ad-slot"
import { availableTools, tools, SITE } from "@/lib/tools"
import { ToolBrowser } from "@/components/tool-browser"
import { AIAssistantCTA } from "@/components/ai-assistant-cta"
import { Particles } from "@/components/particles"
import { HeroContent } from "@/components/hero-content"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function HomePage() {
  const availableCount = availableTools().length

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <Particles />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        {/* Animated background elements - only on large screens */}
        <div className="absolute inset-0 overflow-hidden hidden lg:block">
          <div className="absolute -top-40 -right-40 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl [animation-delay:1s]" />
        </div>
        
        <HeroContent />
      </section>

      {/* AI Assistant Section */}
      <ScrollReveal delay={100}>
        <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:max-w-7xl lg:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 sm:mb-8 sm:size-20">
                <Sparkles className="size-8 text-primary sm:size-10" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                ¿No encuentras la herramienta que necesitas?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:mt-6 sm:text-lg">
                Nuestro asistente de IA te ayuda a encontrar la herramienta perfecta. Solo dile qué necesitas hacer y él te recomendará la mejor opción.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:mt-8">
                <AIAssistantCTA />
                <p className="text-sm text-muted-foreground sm:text-base">
                  Ejemplos: "parafrasear texto", "analizar CV", "convertir divisas"
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Stats Section - only on large screens */}
      <ScrollReveal delay={200} direction="up">
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
      </ScrollReveal>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:max-w-7xl">
        <AdSlot placement="home-leaderboard" className="mb-2 sm:mb-4" />
      </div>

      {/* Browse */}
      <ScrollReveal delay={300} direction="up">
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:max-w-7xl lg:py-20">
          <div className="mb-8 text-center sm:mb-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Browse the toolbox</h2>
            <p className="mt-2 text-base text-muted-foreground sm:mt-4 sm:text-lg lg:text-xl">
              {availableCount} tools ready to use — search or filter by category.
            </p>
          </div>
          <ToolBrowser />
        </section>
      </ScrollReveal>
    </>
  )
}
