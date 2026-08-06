"use client"

import Link from "next/link"
import { Wand2, Sparkles, Shield, Zap, Heart, ExternalLink, Share2, Mail, Search, Star, ArrowUpRight, ChevronRight, LayoutGrid, FileText, Palette, Image, Video, Download, Hash, Lock, MessageSquare, Languages, DollarSign, Calculator, ScanText, FileCode2, Tags, Link2, Megaphone, QrCode, ImageIcon, Merge, Scissors, Minimize, Ruler, Clock, Type, Baseline, FileText as FileTextIcon, Rss } from "lucide-react"
import { AdSlot } from "@/components/ad-slot"
import { categories, toolsByCategory, SITE, availableTools } from "@/lib/tools"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useState } from "react"

const categoryIcons: Record<string, any> = {
  converters: LayoutGrid,
  generators: Sparkles,
  design: Palette,
  images: Image,
  media: Video,
  web: Download,
  development: Hash,
  pdf: FileText,
}

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/somosanubis.ai/", icon: ExternalLink },
  { name: "Email", href: "mailto:somos.anubis.ia@gmail.com", icon: Mail },
]

const usefulLinks = [
  { name: "Todas las herramientas", href: "/tools" },
  { name: "Herramientas populares", href: "/popular" },
  { name: "Herramientas nuevas", href: "/new" },
  { name: "Blog", href: "/blog" },
  { name: "Tutoriales", href: "/tutorials" },
]

const legalLinks = [
  { name: "Términos de uso", href: "/terms" },
  { name: "Política de privacidad", href: "/privacy" },
  { name: "Cookies", href: "/cookies" },
  { name: "Contacto", href: "/contact" },
  { name: "FAQ", href: "/faq" },
]

export function SiteFooter() {
  const [searchQuery, setSearchQuery] = useState("")
  
  const allAvailableTools = availableTools()
  const popularTools = allAvailableTools.slice(0, 6)
  const newTools = allAvailableTools.slice(-6).reverse()
  
  const filteredCategories = categories.filter(c => {
    const categoryTools = toolsByCategory(c.slug).filter(t => t.available)
    return categoryTools.length > 0
  })

  return (
    <footer className="border-t border-border bg-gradient-to-b from-background via-background to-muted/30">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <AdSlot placement="footer-banner" className="mb-8" />
      </div>
      
      {/* Newsletter Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal delay={100} direction="up">
          <div className="mb-12 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-8 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/20">
              <Mail className="size-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-bold">Mantente actualizado</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Recibe notificaciones sobre nuevas herramientas y actualizaciones
            </p>
            <div className="mx-auto flex max-w-md gap-2">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Suscribirse
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1.3fr_repeat(2,1fr)]">
          {/* Brand Section */}
          <ScrollReveal delay={100} direction="up">
            <div className="max-w-sm">
              <Link href="/" className="group flex items-center gap-3">
                <img 
                  src="/anubis-ai.png" 
                  alt="Anubis AI Logo" 
                  className="size-12 rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                />
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tight">{SITE.name}</span>
                  <span className="text-xs text-muted-foreground">AI-Powered Tools</span>
                </div>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {SITE.description}
              </p>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2.5 text-xs font-medium text-primary transition-all hover:bg-primary/10">
                  <Shield className="size-4" />
                  100% Privado
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2.5 text-xs font-medium text-primary transition-all hover:bg-primary/10">
                  <Zap className="size-4" />
                  Sin Registro
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2.5 text-xs font-medium text-primary transition-all hover:bg-primary/10">
                  <Star className="size-4" />
                  {allAvailableTools.length} Herramientas
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2.5 text-xs font-medium text-primary transition-all hover:bg-primary/10">
                  <Heart className="size-4 text-red-500" />
                  Gratis
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold text-muted-foreground">Síguenos</p>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground hover:scale-110 hover:border-primary/50"
                      title={social.name}
                    >
                      <social.icon className="size-5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Popular Tools */}
          <ScrollReveal delay={200} direction="up">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Star className="size-4 text-primary" />
                Herramientas Populares
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {popularTools.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/${t.slug}`}
                      className="group flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground hover:translate-x-1"
                    >
                      <ChevronRight className="size-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Categories */}
          <ScrollReveal delay={300} direction="up">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <LayoutGrid className="size-4 text-primary" />
                Categorías
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {filteredCategories.map((c) => {
                  const Icon = categoryIcons[c.slug] || Sparkles
                  const toolCount = toolsByCategory(c.slug).filter(t => t.available).length
                  return (
                    <li key={c.slug}>
                      <Link
                        href={`/category/${c.slug}`}
                        className="group flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground hover:translate-x-1"
                      >
                        <Icon className="size-3.5 text-primary/70" />
                        {c.name}
                        <span className="text-xs text-muted-foreground/60">({toolCount})</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom Bar */}
        <ScrollReveal delay={400} direction="up">
          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
            <div className="flex flex-col gap-1">
              <p>
                © {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.
              </p>
              <p className="flex items-center gap-1 text-xs">
                Hecho con <Heart className="size-3 text-red-500 fill-red-500 animate-pulse" /> usando Next.js & Tailwind CSS
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  )
}
