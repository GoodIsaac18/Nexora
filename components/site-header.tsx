"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Wand2 } from "lucide-react"
import { categories, SITE } from "@/lib/tools"
import { ThemeToggle } from "@/components/theme-toggle"
import { CommandPaletteTrigger } from "@/components/command-palette"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
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
            src="/nexora.png" 
            alt="Nexora Logo" 
            className="size-9 rounded-lg transition-transform duration-300 group-hover:rotate-6"
          />
          <span className="text-lg font-semibold tracking-tight">{SITE.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Categories">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/#${c.slug}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {c.name}
            </Link>
          ))}
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
                href={`/#${c.slug}`}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
