"use client"

import { useState } from "react"
import { ArrowLeftRight } from "lucide-react"
import { CopyButton } from "@/components/copy-button"
import { FieldLabel } from "@/components/tools/ui"

function encode(s: string) {
  try {
    return btoa(unescape(encodeURIComponent(s)))
  } catch {
    return ""
  }
}
function decode(s: string) {
  try {
    return decodeURIComponent(escape(atob(s.trim())))
  } catch {
    return "⚠ Invalid Base64 input"
  }
}

export function Base64Encoder() {
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [input, setInput] = useState("")

  const output = mode === "encode" ? encode(input) : decode(input)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl border border-border bg-card p-1">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-lg px-5 py-1.5 text-sm font-medium capitalize transition-colors ${
                mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <FieldLabel htmlFor="b64-in">{mode === "encode" ? "Plain text" : "Base64"}</FieldLabel>
          <textarea
            id="b64-in"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Type text to encode…" : "Paste Base64 to decode…"}
            spellCheck={false}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[240px]"
          />
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">{mode === "encode" ? "Base64" : "Plain text"}</span>
            <CopyButton value={output} />
          </div>
          <pre className="scroll-thin min-h-[240px] overflow-auto whitespace-pre-wrap break-all rounded-xl border border-border bg-background p-3 font-mono text-sm leading-relaxed">
            {output || <span className="text-muted-foreground">Output appears here…</span>}
          </pre>
        </div>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
        <ArrowLeftRight className="size-4" /> Unicode-safe, runs entirely in your browser.
      </p>
    </div>
  )
}
