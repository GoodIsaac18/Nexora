"use client"

import { useMemo, useState } from "react"
import { FieldLabel } from "@/components/tools/ui"

export function WordCounter() {
  const [text, setText] = useState("")

  const stats = useMemo(() => {
    const trimmed = text.trim()
    const words = trimmed ? trimmed.split(/\s+/).length : 0
    const chars = text.length
    const charsNoSpaces = text.replace(/\s/g, "").length
    const sentences = trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0
    const paragraphs = trimmed ? trimmed.split(/\n{2,}/).filter((p) => p.trim()).length : 0
    const readingTime = Math.ceil(words / 200)
    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime }
  }, [text])

  const cards = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.chars },
    { label: "Characters (no spaces)", value: stats.charsNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading time", value: `${stats.readingTime} min` },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold tabular-nums text-primary">{c.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <FieldLabel htmlFor="wc-input">Your text</FieldLabel>
        <textarea
          id="wc-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text…"
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[280px] font-sans"
        />
      </div>
    </div>
  )
}
