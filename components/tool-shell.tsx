import Link from "next/link"
import type { ReactNode } from "react"
import { ChevronRight, House } from "lucide-react"
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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
              <House className="size-3.5" />
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
          </li>
          <ChevronRight className="size-3.5" />
          {category && (
            <>
              <li>
                <Link href={`/#${category.slug}`} className="transition-colors hover:text-foreground">
                  {category.name}
                </Link>
              </li>
              <ChevronRight className="size-3.5" />
            </>
          )}
          <li className="font-medium text-foreground" aria-current="page">
            {tool.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="min-w-0">
          <header className="mb-6 flex animate-fade-in-up items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Icon className="size-7" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">{tool.title}</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground text-pretty">{tool.longDescription}</p>
            </div>
          </header>

          <AdSlot placement="tool-top" className="mb-6 lg:hidden" />

          <div className="animate-fade-in-up [animation-delay:80ms]">{children}</div>

          {related.length > 0 && (
            <section className="mt-16" aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-lg font-semibold tracking-tight">
                Related tools
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="hidden lg:block">
          <AdSlot placement="tool-sidebar" sticky />
        </div>
      </div>
    </div>
  )
}
