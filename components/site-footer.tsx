"use client"

import Link from "next/link"
import { Wand2, Sparkles, Shield, Zap, Heart, ExternalLink, Share2, Mail } from "lucide-react"
import { AdSlot } from "@/components/ad-slot"
import { categories, toolsByCategory, SITE } from "@/lib/tools"
import { ScrollReveal } from "@/components/scroll-reveal"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <AdSlot placement="footer-banner" className="mb-8" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1.2fr_repeat(3,1fr)]">
          {/* Brand Section */}
          <ScrollReveal delay={100} direction="up">
            <div className="max-w-sm">
              <Link href="/" className="group flex items-center gap-3">
                <img 
                  src="/anubis-ai.png" 
                  alt="Anubis AI Logo" 
                  className="size-10 rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                />
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-tight">{SITE.name}</span>
                  <span className="text-[10px] text-muted-foreground">AI-Powered Tools</span>
                </div>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {SITE.description}
              </p>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-xs font-medium text-primary transition-all hover:bg-primary/10">
                  <Shield className="size-3.5" />
                  100% Privado
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-xs font-medium text-primary transition-all hover:bg-primary/10">
                  <Zap className="size-3.5" />
                  Sin Registro
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <Link href="#" className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground hover:scale-110">
                  <ExternalLink className="size-4" />
                </Link>
                <Link href="#" className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground hover:scale-110">
                  <Share2 className="size-4" />
                </Link>
                <Link href="#" className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground hover:scale-110">
                  <Mail className="size-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Categories */}
          {categories.slice(0, 3).map((c, index) => (
            <ScrollReveal key={c.slug} delay={200 + index * 100} direction="up">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="size-3.5 text-primary" />
                  {c.name}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {toolsByCategory(c.slug)
                    .filter((t) => t.available)
                    .slice(0, 5)
                    .map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/${t.slug}`}
                          className="text-sm text-muted-foreground transition-all duration-300 hover:text-foreground hover:translate-x-1"
                        >
                          {t.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom Bar */}
        <ScrollReveal delay={500} direction="up">
          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
            <div className="flex flex-col gap-1">
              <p>
                © {new Date().getFullYear()} {SITE.name}. Todas las herramientas se ejecutan localmente en tu navegador.
              </p>
              <p className="flex items-center gap-1 text-xs">
                Hecho con <Heart className="size-3 text-red-500 fill-red-500 animate-pulse" /> usando Next.js & Tailwind CSS
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6 text-xs">
              <Link href="/terms" className="transition-colors duration-300 hover:text-foreground">
                Términos
              </Link>
              <Link href="/privacy" className="transition-colors duration-300 hover:text-foreground">
                Privacidad
              </Link>
              <Link href="#" className="transition-colors duration-300 hover:text-foreground">
                Contacto
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  )
}
