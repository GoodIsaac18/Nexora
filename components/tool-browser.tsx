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
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools… e.g. JSON, password, color"
          aria-label="Search tools"
          className="h-14 w-full rounded-2xl border border-border bg-card pl-12 pr-12 text-base shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="mt-4 flex flex-wrap gap-2">
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
      <div className="mt-10">
        {grouped.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="text-muted-foreground">
              No tools match <span className="font-medium text-foreground">{`"${query}"`}</span>.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {grouped.map(({ category, items }, index) => (
              <section key={category.slug} id={category.slug} className="scroll-mt-24">
                {index === 1 && (
                  <AdSlot placement="home-infeed" className="mb-10" />
                )}
                <div className="mb-4 flex items-baseline justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">{category.name}</h2>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  <span className="shrink-0 text-sm text-muted-foreground">{items.length}</span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((t) => (
                    <ToolCard key={t.slug} tool={t} />
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
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
