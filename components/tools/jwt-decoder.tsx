"use client"

import { useMemo, useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { FieldLabel, Panel, textAreaClass } from "@/components/tools/ui"

function decodePart(part: string): string {
  try {
    const padded = part.replace(/-/g, "+").replace(/_/g, "/")
    const json = atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), "="))
    return JSON.stringify(JSON.parse(json), null, 2)
  } catch {
    return "Invalid segment"
  }
}

export function JwtDecoder() {
  const [token, setToken] = useState("")

  const parts = useMemo(() => {
    const t = token.trim()
    if (!t) return null
    const segs = t.split(".")
    if (segs.length !== 3) return { error: "A JWT must have three dot-separated parts." as const }
    return {
      header: decodePart(segs[0]),
      payload: decodePart(segs[1]),
      signature: segs[2],
    }
  }, [token])

  return (
    <div className="flex flex-col gap-4">
      <Panel>
        <FieldLabel htmlFor="jwt">Paste JWT</FieldLabel>
        <textarea
          id="jwt"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIs…"
          spellCheck={false}
          className={textAreaClass("min-h-[100px] font-mono text-xs")}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Decoding happens locally. Signatures are not verified.
        </p>
      </Panel>

      {parts && "error" in parts && (
        <p className="text-sm text-destructive">{parts.error}</p>
      )}

      {parts && !("error" in parts) && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel>
            <div className="mb-2 flex items-center justify-between">
              <FieldLabel>Header</FieldLabel>
              <CopyButton value={parts.header} />
            </div>
            <pre className="scroll-thin max-h-[280px] overflow-auto rounded-xl border border-border bg-background p-3 font-mono text-xs">
              {parts.header}
            </pre>
          </Panel>
          <Panel>
            <div className="mb-2 flex items-center justify-between">
              <FieldLabel>Payload</FieldLabel>
              <CopyButton value={parts.payload} />
            </div>
            <pre className="scroll-thin max-h-[280px] overflow-auto rounded-xl border border-border bg-background p-3 font-mono text-xs">
              {parts.payload}
            </pre>
          </Panel>
          <Panel className="lg:col-span-2">
            <FieldLabel>Signature (base64url)</FieldLabel>
            <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{parts.signature}</p>
          </Panel>
        </div>
      )}
    </div>
  )
}
