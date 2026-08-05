"use client"

import { useMemo, useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { FieldLabel } from "@/components/tools/ui"

const QUALITIES = [
  { key: "maxresdefault", label: "Max resolution", w: 1280 },
  { key: "sddefault", label: "Standard", w: 640 },
  { key: "hqdefault", label: "High", w: 480 },
  { key: "mqdefault", label: "Medium", w: 320 },
  { key: "default", label: "Default", w: 120 },
] as const

function extractVideoId(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed
  try {
    const url = new URL(trimmed)
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1).split("/")[0] || null
    const v = url.searchParams.get("v")
    if (v) return v
    const embed = url.pathname.match(/\/embed\/([\w-]{11})/)
    if (embed) return embed[1]
    const shorts = url.pathname.match(/\/shorts\/([\w-]{11})/)
    if (shorts) return shorts[1]
  } catch {
    return null
  }
  return null
}

export function YoutubeThumbnailDownloader() {
  const [url, setUrl] = useState("")
  const videoId = useMemo(() => extractVideoId(url), [url])

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <FieldLabel htmlFor="yt-url">YouTube URL or video ID</FieldLabel>
        <input
          id="yt-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=…"
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="mt-4">
          {url && !videoId && (
            <p className="mt-2 text-sm text-destructive">Could not find a valid video ID.</p>
          )}
        </div>
      </div>
      {videoId && (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {QUALITIES.map((q) => {
              const imgUrl = `https://img.youtube.com/vi/${videoId}/${q.key}.jpg`
              return (
                <div key={q.key} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{q.label}</span>
                    <CopyButton value={imgUrl} label="Copy URL" />
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`${q.label} thumbnail`}
                    className="aspect-video w-full rounded-lg border border-border object-cover bg-muted"
                    loading="lazy"
                  />
                  <a
                    href={imgUrl}
                    download={`youtube-${videoId}-${q.key}.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center text-sm font-medium text-primary hover:underline"
                  >
                    Open / save image
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
