"use client"

import { useState } from "react"
import { Download, ExternalLink, Loader2 } from "lucide-react"
import type { MediaResolveResult } from "@/lib/media-types"
import { ActionButton, FieldLabel, Panel, inputClass } from "@/components/tools/ui"

type MediaDownloaderProps = {
  slug: string
  placeholder: string
  hint?: string
}

function proxyDownloadUrl(sourceUrl: string, filename: string) {
  return `/api/media/proxy?url=${encodeURIComponent(sourceUrl)}&filename=${encodeURIComponent(filename)}`
}

function safeFilename(title: string, ext: string, index: number) {
  const base = title.slice(0, 40).replace(/[^\w\s-]/g, "").trim() || "video"
  return `${base}-${index + 1}.${ext}`
}

export function MediaDownloader({ slug, placeholder, hint }: MediaDownloaderProps) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<MediaResolveResult | null>(null)

  async function resolve() {
    setError(null)
    setResult(null)
    const trimmed = url.trim()
    if (!trimmed) return

    setLoading(true)
    try {
      const res = await fetch("/api/media/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed, expectedSlug: slug }),
      })
      const data = (await res.json()) as MediaResolveResult | { error?: string }
      if (!res.ok || "error" in data) {
        setError(("error" in data && data.error) || "No se pudo obtener el video.")
        return
      }
      setResult(data)
    } catch {
      setError("Error de red. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <Panel>
        <FieldLabel htmlFor={`media-url-${slug}`}>Enlace del video</FieldLabel>
        <input
          id={`media-url-${slug}`}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder}
          className={inputClass()}
        />
        {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
        <p className="mt-2 text-xs text-muted-foreground">
          Solo para contenido público y con permiso del autor. No almacenamos tus enlaces.
        </p>
        <div className="mt-4">
          <ActionButton onClick={resolve} disabled={loading || !url.trim()}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Buscando…
              </>
            ) : (
              "Obtener descarga"
            )}
          </ActionButton>
        </div>
      </Panel>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <Panel className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium">{result.title}</p>
            {result.note && <p className="mt-1 text-xs text-muted-foreground">{result.note}</p>}
          </div>

          {result.thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={result.thumbnail}
              alt={`Thumbnail de ${result.title || 'video'}`}
              className="max-h-48 w-auto rounded-lg border border-border object-cover"
            />
          )}

          <ul className="flex flex-col gap-2">
            {result.options.map((opt, i) => {
              const filename = safeFilename(result.title, opt.ext, i)
              const proxy = proxyDownloadUrl(opt.url, filename)
              return (
                <li
                  key={`${opt.url}-${i}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-background p-3"
                >
                  <span className="text-sm">
                    {opt.label}{" "}
                    <span className="text-muted-foreground">({opt.ext})</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={proxy}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      <Download className="size-4" />
                      Descargar
                    </a>
                    <a
                      href={opt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm hover:bg-muted"
                    >
                      <ExternalLink className="size-4" />
                      Enlace directo
                    </a>
                  </div>
                </li>
              )
            })}
          </ul>
        </Panel>
      )}
    </div>
  )
}
