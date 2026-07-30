"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import { AdSlot } from "@/components/ad-slot"
import { tools, categories } from "@/lib/tools"
import { ToolCard } from "@/components/tool-card"
import { cn } from "@/lib/utils"

export function ToolBrowser() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tools.filter((t) => {
      const matchesCategory = !activeCategory || t.category === activeCategory
      if (!matchesCategory) return false
      if (!q) return true
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
      )
    })
  }, [query, activeCategory])

  const grouped = useMemo(() => {
    return categories
      .map((c) => ({ category: c, items: filtered.filter((t) => t.category === c.slug) }))
      .filter((g) => g.items.length > 0)
  }, [filtered])

  return (
    <div id="search" className="scroll-mt-24">
      {/* Search bar */}
      <div className="relative group">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary lg:left-5 lg:size-6" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools… e.g. JSON, password, color"
          aria-label="Search tools"
          className="h-14 w-full rounded-2xl border border-border bg-card pl-12 pr-12 text-base shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10 lg:h-16 lg:rounded-3xl lg:border-2 lg:bg-card/50 lg:backdrop-blur-sm lg:pl-14 lg:pr-14 lg:text-lg lg:shadow-lg lg:focus:bg-card lg:hover:border-primary/30"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 lg:right-4 lg:size-10 lg:rounded-2xl lg:hover:scale-110"
          >
            <X className="size-4 lg:size-5" />
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="mt-4 flex flex-wrap gap-2 lg:mt-6 lg:gap-3">
        <FilterChip active={activeCategory === null} onClick={() => setActiveCategory(null)}>
          All
        </FilterChip>
        {categories.map((c) => (
          <FilterChip
            key={c.slug}
            active={activeCategory === c.slug}
            onClick={() => setActiveCategory(activeCategory === c.slug ? null : c.slug)}
          >
            {c.name}
          </FilterChip>
        ))}
      </div>

      {/* Results */}
      <div className="mt-10 lg:mt-12">
        {grouped.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-16 text-center transition-all hover:border-primary/30 lg:rounded-3xl lg:border-2 lg:py-24">
            <p className="text-muted-foreground sm:text-lg">
              No tools match <span className="font-medium text-foreground">{`"${query}"`}</span>.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-12 lg:gap-16">
            {grouped.map(({ category, items }, index) => (
              <section key={category.slug} id={category.slug} className="scroll-mt-24 lg:scroll-mt-32 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                {index === 1 && (
                  <AdSlot placement="home-infeed" className="mb-10 lg:mb-12" />
                )}
                <div className="mb-4 flex items-baseline justify-between gap-4 lg:mb-6">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight lg:text-3xl lg:font-bold">{category.name}</h2>
                    <p className="text-sm text-muted-foreground lg:mt-1 lg:text-lg">{category.description}</p>
                  </div>
                  <span className="shrink-0 text-sm text-muted-foreground lg:rounded-full lg:bg-primary/10 lg:px-4 lg:py-2 lg:font-semibold lg:text-primary">
                    {items.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((t, i) => (
                    <div key={t.slug} style={{ animationDelay: `${i * 50}ms` }}>
                      <ToolCard tool={t} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 lg:border-2 lg:px-6 lg:py-2.5 lg:text-base lg:font-semibold",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 hover:shadow-xl hover:shadow-primary/40 active:scale-95"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground hover:scale-105 active:scale-95 lg:bg-background/50 lg:backdrop-blur-sm lg:hover:border-primary/50 lg:hover:bg-card",
      )}
    >
      {children}
    </button>
  )
}
