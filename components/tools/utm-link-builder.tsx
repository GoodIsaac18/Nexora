"use client"

import { useMemo, useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { FieldLabel } from "@/components/tools/ui"

function buildUtmUrl(
  base: string,
  params: { source: string; medium: string; campaign: string; term: string; content: string },
): string {
  const trimmed = base.trim()
  if (!trimmed) return ""
  try {
    const u = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`)
    const map: [string, string][] = [
      ["utm_source", params.source],
      ["utm_medium", params.medium],
      ["utm_campaign", params.campaign],
      ["utm_term", params.term],
      ["utm_content", params.content],
    ]
    for (const [key, val] of map) {
      if (val.trim()) u.searchParams.set(key, val.trim())
    }
    return u.toString()
  } catch {
    return "URL base no válida"
  }
}

export function UtmLinkBuilder() {
  const [base, setBase] = useState("https://example.com/landing")
  const [source, setSource] = useState("")
  const [medium, setMedium] = useState("")
  const [campaign, setCampaign] = useState("")
  const [term, setTerm] = useState("")
  const [content, setContent] = useState("")

  const out = useMemo(
    () => buildUtmUrl(base, { source, medium, campaign, term, content }),
    [base, source, medium, campaign, term, content],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <FieldLabel htmlFor="utm-base">Base URL</FieldLabel>
        <input id="utm-base" value={base} onChange={(e) => setBase(e.target.value)} className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <FieldLabel htmlFor="utm-source">utm_source</FieldLabel>
        <input
          id="utm-source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="newsletter, google, facebook"
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <FieldLabel htmlFor="utm-medium">utm_medium</FieldLabel>
        <input
          id="utm-medium"
          value={medium}
          onChange={(e) => setMedium(e.target.value)}
          placeholder="email, cpc, social"
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <FieldLabel htmlFor="utm-campaign">utm_campaign</FieldLabel>
        <input
          id="utm-campaign"
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
          placeholder="spring_sale"
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="utm-term">utm_term (opcional)</FieldLabel>
          <input id="utm-term" value={term} onChange={(e) => setTerm(e.target.value)} className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <FieldLabel htmlFor="utm-content">utm_content (opcional)</FieldLabel>
          <input
            id="utm-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Enlace con UTM</span>
          <CopyButton value={out.startsWith("http") ? out : ""} />
        </div>
        <pre className="min-h-[200px] whitespace-pre-wrap break-all rounded-xl border border-border bg-background p-3 font-mono text-sm">
          {out || "—"}
        </pre>
      </div>
    </div>
  )
}
