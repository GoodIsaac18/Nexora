"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react"
import { AdSlot } from "@/components/ad-slot"
import { tools, categories } from "@/lib/tools"
import { ToolCard } from "@/components/tool-card"
import { cn } from "@/lib/utils"

export function ToolBrowser() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [visibleItems, setVisibleItems] = useState<Record<string, Set<number>>>({})
  const [scrolledCarousels, setScrolledCarousels] = useState<Record<string, boolean>>({})
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tools.filter((t) => {
      // Only show available tools
      if (!t.available) return false
      
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

  const scrollCarousel = (categorySlug: string, direction: 'left' | 'right') => {
    const container = carouselRefs.current[categorySlug]
    if (!container) return

    const scrollAmount = 300
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  // Detectar elementos visibles y scroll en cada carrusel
  useEffect(() => {
    const updateVisibleItems = () => {
      Object.keys(carouselRefs.current).forEach(categorySlug => {
        const container = carouselRefs.current[categorySlug]
        if (!container) return

        const containerRect = container.getBoundingClientRect()
        const items = container.querySelectorAll('[data-item-index]')
        
        const categoryVisible = new Set<number>()
        
        items.forEach((item, index) => {
          const itemRect = item.getBoundingClientRect()
          
          // Usar buffer para mejor detección en ambos móviles y PC
          const buffer = isMobile ? 50 : 20
          
          // Si está dentro del área visible del contenedor (con buffer)
          if (itemRect.left >= containerRect.left - buffer && itemRect.right <= containerRect.right + buffer) {
            categoryVisible.add(index)
          }
        })
        
        setVisibleItems(prev => ({
          ...prev,
          [categorySlug]: categoryVisible
        }))

        // Detectar si el carrusel ha sido scrolleado
        const hasScrolled = container.scrollLeft > 5 // Umbral más bajo para PC
        setScrolledCarousels(prev => ({
          ...prev,
          [categorySlug]: hasScrolled
        }))
      })
    }

    // Actualizar inicialmente con un pequeño delay para asegurar que el DOM esté listo
    const timeoutId = setTimeout(updateVisibleItems, 100)

    // Actualizar en scroll con throttle para mejor rendimiento en móvil
    let scrollTimeout: NodeJS.Timeout
    Object.keys(carouselRefs.current).forEach(categorySlug => {
      const container = carouselRefs.current[categorySlug]
      if (container) {
        container.addEventListener('scroll', () => {
          clearTimeout(scrollTimeout)
          scrollTimeout = setTimeout(updateVisibleItems, 50) // Throttle más rápido para móvil
        }, { passive: true })
      }
    })

    // Actualizar en resize
    window.addEventListener('resize', updateVisibleItems)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(scrollTimeout)
      Object.keys(carouselRefs.current).forEach(categorySlug => {
        const container = carouselRefs.current[categorySlug]
        if (container) {
          container.removeEventListener('scroll', updateVisibleItems)
        }
      })
      window.removeEventListener('resize', updateVisibleItems)
    }
  }, [grouped, isMobile])

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
          <div className="flex flex-col gap-8 lg:gap-12">
            {grouped.map(({ category, items }, index) => (
              <section key={category.slug} id={category.slug} className="scroll-mt-24 lg:scroll-mt-32 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                {index === 1 && (
                  <AdSlot placement="home-infeed" className="mb-8 lg:mb-10" />
                )}
                <div className="mb-4 flex items-baseline justify-between gap-4 lg:mb-6">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight lg:text-3xl lg:font-bold">{category.name}</h2>
                    <p className="text-sm text-muted-foreground lg:mt-1 lg:text-lg">{category.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/category/${category.slug}`}
                      className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:text-primary lg:hidden"
                    >
                      View all
                    </Link>
                    <Link
                      href={`/category/${category.slug}`}
                      className="hidden rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:text-primary lg:inline-flex"
                    >
                      View category
                    </Link>
                    <span className="shrink-0 text-sm text-muted-foreground lg:rounded-full lg:bg-primary/10 lg:px-4 lg:py-2 lg:font-semibold lg:text-primary">
                      {items.length}
                    </span>
                  </div>
                </div>

                {/* Horizontal Carousel */}
                <div className="relative group">
                  <button
                    onClick={() => scrollCarousel(category.slug, 'left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex size-10 items-center justify-center rounded-full bg-background border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:border-primary/50 lg:size-12"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="size-5" />
                  </button>

                  <div className="relative">
                    {/* Fade gradients */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 lg:w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 lg:w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />

                    <div
                      ref={(el) => {
                        carouselRefs.current[category.slug] = el
                      }}
                      className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-2 pl-8 pr-8 sm:pl-12 sm:pr-12 lg:pl-16 lg:pr-16 scroll-smooth carousel-scrollbar"
                      style={{
                        scrollSnapType: 'x mandatory',
                        scrollPaddingInlineStart: isMobile ? '0px' : '32px',
                        scrollPaddingInlineEnd: isMobile ? '0px' : '32px',
                        WebkitOverflowScrolling: 'touch'
                      }}
                    >
                      {items.map((t, i) => {
                        const hasScrolled = scrolledCarousels[category.slug] || false
                        const isVisible = visibleItems[category.slug]?.has(i)
                        // Solo aplicar fade en móvil, en PC mostrar siempre visible
                        const shouldFade = isMobile && hasScrolled && !isVisible
                        
                        return (
                          <div
                            key={t.slug}
                            data-category={category.slug}
                            data-item-index={i}
                            className="flex-shrink-0 w-[85vw] sm:w-[80vw] md:w-[45vw] lg:w-[30vw] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                            style={{
                              scrollSnapAlign: isMobile ? 'center' : 'start',
                              opacity: isMobile && shouldFade ? 0.3 : 1,
                              transform: isMobile && shouldFade ? 'scale(0.95)' : 'scale(1)',
                              willChange: isMobile ? 'opacity, transform' : 'auto'
                            }}
                          >
                            <ToolCard tool={t} />
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => scrollCarousel(category.slug, 'right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex size-10 items-center justify-center rounded-full bg-background border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:border-primary/50 lg:size-12"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="size-5" />
                  </button>
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
