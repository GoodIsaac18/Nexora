import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Sparkles } from "lucide-react"
import { categories, getCategory, toolsByCategory, availableTools, SITE } from "@/lib/tools"
import { ToolCard } from "@/components/tool-card"

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getCategory(params.slug)
  if (!category) return {}

  const items = toolsByCategory(category.slug)
  const availableCount = items.filter((tool) => tool.available).length

  return {
    title: `${category.name} Tools | ${SITE.name}`,
    description: `Browse ${availableCount} available ${category.name.toLowerCase()} tools. ${category.description}`,
    alternates: {
      canonical: `/category/${category.slug}`,
    },
    keywords: [category.name, category.slug, "online tools", "free tools"],
    openGraph: {
      title: `${category.name} Tools | ${SITE.name}`,
      description: `Browse ${availableCount} available ${category.name.toLowerCase()} tools. ${category.description}`,
      url: `${SITE.url}/category/${category.slug}`,
      siteName: SITE.name,
      type: "website",
    },
  }
}

export default function CategoryHubPage({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug)
  if (!category) notFound()

  const items = toolsByCategory(category.slug)
  const availableCount = availableTools().filter((tool) => tool.category === category.slug).length
  const featured = items.slice(0, 3)
  const guideSteps = [
    `Pick the tool that matches your ${category.slug} workflow.`,
    `Open the tool and enter your content or file.`,
    `Process locally when possible and copy or download the result.`,
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:max-w-7xl lg:py-16">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
          </li>
          <ChevronRight className="size-3.5" />
          <li>
            <Link href="/category" className="transition-colors hover:text-foreground">
              Categories
            </Link>
          </li>
          <ChevronRight className="size-3.5" />
          <li className="font-medium text-foreground" aria-current="page">
            {category.name}
          </li>
        </ol>
      </nav>

      <section className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-lg sm:p-8 lg:p-12">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            <Sparkles className="size-4" />
            Category hub
          </span>
          <span className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground">
            {items.length} total tools
          </span>
          <span className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground">
            {availableCount} available now
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{category.name} tools</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {category.description} This hub groups the most relevant tools for this workflow so users can move from search to action faster.
        </p>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Why this category matters</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Category pages help both users and search engines understand the site structure. They also make it easier to rank for broader queries like "{category.name.toLowerCase()} tools" or "best {category.slug} tools".
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {guideSteps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-semibold text-primary">0{index + 1}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Featured tools</h2>
          <div className="mt-5 grid gap-4">
            {featured.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">All tools in this category</h2>
            <p className="mt-1 text-sm text-muted-foreground">Available and upcoming tools grouped together.</p>
          </div>
          <Link href="/category" className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary sm:inline-flex">
            Back to categories
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Frequently searched questions</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <details className="group rounded-2xl border border-border bg-background p-4">
            <summary className="cursor-pointer list-none font-medium">
              What tools should I open first?
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Start with the tools that match the highest-intent searches in this category, then link to related tools from the same workflow.
            </p>
          </details>
          <details className="group rounded-2xl border border-border bg-background p-4">
            <summary className="cursor-pointer list-none font-medium">
              Why make category hubs?
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              They improve internal linking, give Google clearer topical clusters, and help users discover the right page faster.
            </p>
          </details>
        </div>
      </section>
    </div>
  )
}
