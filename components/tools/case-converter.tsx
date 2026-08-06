"use client"

import { useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { FieldLabel } from "@/components/tools/ui"

function words(s: string) {
  return s
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

const transforms: Record<string, (s: string) => string> = {
  "UPPERCASE": (s) => s.toUpperCase(),
  "lowercase": (s) => s.toLowerCase(),
  "Title Case": (s) => words(s).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" "),
  "Sentence case": (s) => {
    const l = s.toLowerCase()
    return l.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
  },
  "camelCase": (s) =>
    words(s)
      .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
      .join(""),
  "PascalCase": (s) => words(s).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(""),
  "snake_case": (s) => words(s).map((w) => w.toLowerCase()).join("_"),
  "kebab-case": (s) => words(s).map((w) => w.toLowerCase()).join("-"),
  "CONSTANT_CASE": (s) => words(s).map((w) => w.toUpperCase()).join("_"),
}

export function CaseConverter() {
  const [text, setText] = useState("The quick brown Fox")

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <FieldLabel htmlFor="cc-input">Input text</FieldLabel>
        <textarea
          id="cc-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something…"
          className="rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[100px] sm:min-h-[120px] font-sans"
        />
      </div>
      <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
        {Object.entries(transforms).map(([label, fn]) => {
          const value = text ? fn(text) : ""
          return (
            <div
              key={label}
              className="flex items-center justify-between gap-2 sm:gap-3 rounded-xl border border-border bg-card px-3 sm:px-4 py-2.5 sm:py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="truncate font-mono text-xs sm:text-sm">{value || "—"}</p>
              </div>
              <CopyButton value={value} label="" className="shrink-0 px-2 sm:px-3" disabled={!value} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
