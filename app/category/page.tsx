import type { Metadata } from "next"
import Link from "next/link"
import { categories, toolsByCategory, availableTools, SITE } from "@/lib/tools"

export const metadata: Metadata = {
  title: `Tool Categories | ${SITE.name}`,
  description: "Browse all tool categories and jump into the best tools for each task.",
  alternates: {
    canonical: "/category",
  },
  openGraph: {
    title: `Tool Categories | ${SITE.name}`,
    description: "Browse all tool categories and jump into the best tools for each task.",
    url: `${SITE.url}/category`,
    siteName: SITE.name,
    type: "website",
  },
}

export default function CategoryIndexPage() {
  const totalAvailable = availableTools().length

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:max-w-7xl lg:py-16">
      <section className="rounded-3xl border border-border bg-card/60 p-6 shadow-lg backdrop-blur-sm sm:p-8 lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Categories</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Browse tools by category</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Start with the category that matches your task. Every hub groups the most useful tools for a specific intent, so users can discover the right page faster.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="rounded-full bg-primary/10 px-4 py-2 font-medium text-primary">{categories.length} categories</span>
          <span className="rounded-full bg-primary/10 px-4 py-2 font-medium text-primary">{totalAvailable} available tools</span>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const items = toolsByCategory(category.slug)
          return (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">{category.slug}</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight group-hover:text-primary">{category.name}</h2>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{items.length}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{category.description}</p>
              <div className="mt-5 text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
                Open category hub
              </div>
            </Link>
          )
        })}
      </section>
    </div>
  )
}
