"use client"

import { Clock } from "lucide-react"
import Link from "next/link"
import { tools } from "@/lib/tools"
import { useRecentTools } from "@/hooks/use-recent-tools"

export function RecentTools() {
  const { recentTools } = useRecentTools()

  if (recentTools.length === 0) return null

  return (
    <section className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:max-w-7xl">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">Herramientas recientes</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {recentTools.map((recent) => {
            const tool = tools.find(t => t.slug === recent.slug)
            if (!tool) return null
            const Icon = tool.icon
            return (
              <Link
                key={recent.slug}
                href={`/${recent.slug}`}
                className="flex shrink-0 items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all hover:border-primary/30 hover:bg-muted/50"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-medium">{tool.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
