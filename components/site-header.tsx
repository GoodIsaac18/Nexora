"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, MessageSquare } from "lucide-react"
import { categories, SITE } from "@/lib/tools"
import { ThemeToggle } from "@/components/theme-toggle"
import { CommandPaletteTrigger } from "@/components/command-palette"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-300",
        scrolled
          ? "border-border bg-background/80 backdrop-blur-md"
          : "border-transparent bg-background",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <img 
            src="/anubis-ai.png" 
            alt="Anubis AI Logo" 
            className="size-9 rounded-lg transition-transform duration-300 group-hover:rotate-6"
          />
          <span className="text-lg font-semibold tracking-tight">{SITE.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Categories">
          {categories.slice(0, 4).map((c) => (
            <div
              key={c.slug}
              className="relative"
              onMouseEnter={() => setOpenDropdown(c.slug)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                {c.name}
                <ChevronDown className="size-3.5" />
              </button>
              {openDropdown === c.slug && (
                <div className="absolute left-0 top-full mt-1 w-48 rounded-lg border border-border bg-card shadow-lg">
                  <div className="p-2">
                    {categories.filter(cat => cat.slug === c.slug).map(cat => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        View {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Link
            href="/ai-chat"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <MessageSquare className="size-4" />
            AI Chat
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <CommandPaletteTrigger />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          >
            {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "grid overflow-hidden border-border transition-all duration-300 md:hidden",
          open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Categories">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 active:scale-95 hover:bg-muted hover:text-foreground"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/ai-chat"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-primary transition-all duration-200 active:scale-95 hover:bg-primary/10"
            >
              <MessageSquare className="size-4" />
              AI Chat
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
