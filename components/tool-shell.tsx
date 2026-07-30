import Link from "next/link"
import type { ReactNode } from "react"
import { ChevronRight, House, Sparkles } from "lucide-react"
import { AdSlot } from "@/components/ad-slot"
import { getTool, getCategory, relatedTools } from "@/lib/tools"
import { ToolCard } from "@/components/tool-card"

export function ToolShell({ slug, children }: { slug: string; children: ReactNode }) {
  const tool = getTool(slug)
  if (!tool) return null
  const category = getCategory(tool.category)
  const related = relatedTools(slug)
  const Icon = tool.icon

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:py-16 xl:py-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 animate-fade-in-up lg:mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground lg:gap-2">
          <li>
            <Link href="/" className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 transition-all hover:bg-muted hover:text-foreground lg:gap-2 lg:rounded-xl lg:px-3 lg:py-2">
              <House className="size-3.5 lg:size-4" />
              <span>Home</span>
            </Link>
          </li>
          <ChevronRight className="size-3.5 lg:size-4" />
          {category && (
            <>
              <li>
                <Link href={`/#${category.slug}`} className="rounded-lg px-2 py-1 transition-all hover:bg-muted hover:text-foreground lg:rounded-xl lg:px-3 lg:py-2">
                  {category.name}
                </Link>
              </li>
              <ChevronRight className="size-3.5 lg:size-4" />
            </>
          )}
          <li className="rounded-lg bg-primary/10 px-2 py-1 font-semibold text-primary lg:rounded-xl lg:px-3 lg:py-2" aria-current="page">
            {tool.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:gap-12 lg:grid-cols-[minmax(0,1fr)_350px] lg:items-start">
        <div className="min-w-0">
          {/* Header */}
          <header className="mb-6 flex animate-fade-in-up items-start gap-4 lg:mb-8 lg:gap-6">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:rotate-3 lg:size-20 lg:rounded-3xl lg:bg-gradient-to-br lg:from-primary lg:to-primary/80 lg:shadow-2xl lg:shadow-primary/30">
              <Icon className="size-7 lg:size-10" />
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2 lg:gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl lg:text-5xl xl:text-6xl">{tool.title}</h1>
                <Sparkles className="size-5 text-primary lg:size-8 lg:animate-spin-slow" />
              </div>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg lg:mt-4 lg:text-xl">{tool.longDescription}</p>
            </div>
          </header>

          <AdSlot placement="tool-top" className="mb-6 lg:mb-8 lg:hidden" />

          {/* Tool Content */}
          <div className="animate-fade-in-up [animation-delay:80ms]">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg transition-all hover:border-primary/30 lg:rounded-3xl lg:border-2 lg:bg-card/50 lg:backdrop-blur-sm lg:p-8 lg:shadow-xl">
              {children}
            </div>
          </div>

          {/* Related Tools */}
          {related.length > 0 && (
            <section className="mt-12 animate-fade-in-up lg:mt-16" aria-labelledby="related-heading">
              <h2 id="related-heading" className="mb-4 text-lg font-semibold tracking-tight lg:mb-6 lg:text-2xl lg:font-bold">
                Related tools
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:gap-6 lg:grid-cols-3">
                {related.map((t, i) => (
                  <div key={t.slug} style={{ animationDelay: `${i * 100}ms` }}>
                    <ToolCard tool={t} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar - only on large screens */}
        <div className="hidden lg:block animate-slide-in-right">
          <div className="sticky top-8 space-y-6">
            <AdSlot placement="tool-sidebar" />
            
            {/* Quick Info Card */}
            <div className="rounded-3xl border-2 border-border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{category?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Privacy</span>
                  <span className="font-medium text-green-600">100% Local</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Speed</span>
                  <span className="font-medium text-primary">Instant</span>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="rounded-3xl border-2 border-border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {tool.keywords.slice(0, 5).map((keyword, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
