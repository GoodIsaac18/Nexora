"use client"

import { useMemo, useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { FieldLabel, inputClass, Panel } from "@/components/tools/ui"

export function MetaTagGenerator() {
  const [title, setTitle] = useState("My awesome page")
  const [description, setDescription] = useState("A short, compelling description under 160 characters.")
  const [url, setUrl] = useState("https://example.com")
  const [image, setImage] = useState("https://example.com/og.png")

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
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel className="flex flex-col gap-4">
        <div>
          <FieldLabel htmlFor="mt-title">Page title</FieldLabel>
          <input id="mt-title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass()} />
        </div>
        <div>
          <FieldLabel htmlFor="mt-desc">Description</FieldLabel>
          <textarea
            id="mt-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={inputClass("h-auto py-2")}
          />
          <p className="mt-1 text-xs text-muted-foreground">{description.length}/160 characters</p>
        </div>
        <div>
          <FieldLabel htmlFor="mt-url">Canonical URL</FieldLabel>
          <input id="mt-url" value={url} onChange={(e) => setUrl(e.target.value)} className={inputClass()} />
        </div>
        <div>
          <FieldLabel htmlFor="mt-img">Image URL (Open Graph)</FieldLabel>
          <input id="mt-img" value={image} onChange={(e) => setImage(e.target.value)} className={inputClass()} />
        </div>
      </Panel>

      <Panel>
        <div className="mb-2 flex items-center justify-between">
          <FieldLabel>Generated tags</FieldLabel>
          <CopyButton value={output} />
        </div>
        <pre className="scroll-thin min-h-[300px] overflow-auto rounded-xl border border-border bg-background p-3 font-mono text-xs leading-relaxed">
          {output}
        </pre>
      </Panel>
    </div>
  )
}
