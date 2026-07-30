import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Tool } from "@/lib/tools"
import { cn } from "@/lib/utils"

export function ToolCard({ tool, className }: { tool: Tool; className?: string }) {
  const Icon = tool.icon
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-5" />
        </span>
        {tool.available ? (
          <ArrowRight className="size-5 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
        ) : (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            Soon
          </span>
        )}
      </div>
      <h3 className="mt-4 font-semibold tracking-tight">{tool.name}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
    </>
  )

  const base =
    "group relative flex flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-300"

  if (!tool.available) {
    return <div className={cn(base, "opacity-70", className)}>{content}</div>
  }

  return (
    <Link
      href={`/${tool.slug}`}
      className={cn(
        base,
        "hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {content}
    </Link>
  )
}
