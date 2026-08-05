"use client"

import { useMemo, useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { FieldLabel } from "@/components/tools/ui"

export function MetaTagGenerator() {
  const [title, setTitle] = useState("My awesome page")
  const [description, setDescription] = useState("A short, compelling description under 160 characters.")
  const [url, setUrl] = useState("https://nexora-jade-eta.vercel.app")
  const [image, setImage] = useState("https://nexora-jade-eta.vercel.app/og.png")

  const output = useMemo(() => {
    const esc = (s: string) => s.replace(/"/g, "&quot;")
    return `<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${esc(url)}" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${esc(url)}" />
<meta property="og:image" content="${esc(image)}" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${esc(image)}" />`
  }, [title, description, url, image])

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="mt-title">Page title</FieldLabel>
            <input id="mt-title" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <FieldLabel htmlFor="mt-url">Canonical URL</FieldLabel>
            <input id="mt-url" value={url} onChange={(e) => setUrl(e.target.value)} className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <FieldLabel htmlFor="mt-desc">Description</FieldLabel>
            <textarea
              id="mt-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <p className="mt-1 text-xs text-muted-foreground">{description.length}/160 characters</p>
          </div>
          <div>
            <FieldLabel htmlFor="mt-img">Image URL (Open Graph)</FieldLabel>
            <input id="mt-img" value={image} onChange={(e) => setImage(e.target.value)} className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Generated tags</span>
          <CopyButton value={output} />
        </div>
        <pre className="scroll-thin min-h-[300px] overflow-auto rounded-xl border border-border bg-background p-3 font-mono text-xs leading-relaxed">
          {output}
        </pre>
      </div>
    </div>
  )
}
