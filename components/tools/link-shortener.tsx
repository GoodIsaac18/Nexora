"use client"

import { useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { ActionButton, FieldLabel } from "@/components/tools/ui"

type ShortenResult = { shorturl: string; url: string } | { error: string }

export function LinkShortener() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ShortenResult | null>(null)

  async function shorten() {
    setResult(null)
    const trimmed = url.trim()
    if (!trimmed) return
    try {
      new URL(trimmed)
    } catch {
      setResult({ error: "Introduce una URL válida (con https://)." })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      })
      const data = (await res.json()) as { shortUrl?: string; error?: string }
      if (!res.ok || data.error) {
        setResult({ error: data.error ?? "No se pudo acortar el enlace." })
      } else if (data.shortUrl) {
        setResult({ shorturl: data.shortUrl, url: trimmed })
      }
    } catch {
      setResult({ error: "Error de red. Intenta de nuevo." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <FieldLabel htmlFor="ls-url">URL to shorten</FieldLabel>
        <input
          id="long-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://nexora-jade-eta.vercel.app/json-formatter"
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          El acortado se hace en el servidor con is.gd. No guardamos historial en esta app.
        </p>
        <div className="mt-4">
          <ActionButton onClick={shorten} disabled={loading || !url.trim()}>
            {loading ? "Acortando…" : "Acortar enlace"}
          </ActionButton>
        </div>
      </div>
      {result && "error" in result && (
        <p className="text-sm text-destructive">{result.error}</p>
      )}

      {result && "shorturl" in result && (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <span className="text-sm font-medium">Enlace corto</span>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <a
              href={result.shorturl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-primary hover:underline"
            >
              {result.shorturl}
            </a>
            <CopyButton value={result.shorturl} label="Copiar" />
          </div>
        </div>
      )}
    </div>
  )
}
