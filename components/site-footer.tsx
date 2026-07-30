import Link from "next/link"
import { Wand2 } from "lucide-react"
import { AdSlot } from "@/components/ad-slot"
import { categories, toolsByCategory, SITE } from "@/lib/tools"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <AdSlot placement="footer-banner" className="mb-8" />
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Wand2 className="size-4" />
              </span>
              <span className="text-base font-semibold tracking-tight">{SITE.name}</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{SITE.description}</p>
          </div>

          {categories.slice(0, 3).map((c) => (
            <div key={c.slug}>
              <h3 className="text-sm font-semibold">{c.name}</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {toolsByCategory(c.slug)
                  .filter((t) => t.available)
                  .slice(0, 5)
                  .map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/${t.slug}`}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {t.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All tools run locally in your browser.
          </p>
          <p>Built with Next.js &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}
