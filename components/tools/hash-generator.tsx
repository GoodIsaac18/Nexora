"use client"

import { useEffect, useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { FieldLabel, Panel, textAreaClass } from "@/components/tools/ui"

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const

async function hashText(algo: string, text: string) {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest(algo, data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function HashGenerator() {
  const [text, setText] = useState("")
  const [hashes, setHashes] = useState<Record<string, string>>({})

  useEffect(() => {
    let active = true
    if (!text) {
      setHashes({})
      return
    }
    Promise.all(ALGOS.map((a) => hashText(a, text).then((h) => [a, h] as const))).then((entries) => {
      if (active) setHashes(Object.fromEntries(entries))
    })
    return () => {
      active = false
    }
  }, [text])

  return (
    <div className="flex flex-col gap-4">
      <Panel>
        <FieldLabel htmlFor="hash-input">Text to hash</FieldLabel>
        <textarea
          id="hash-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type text to hash…"
          className={textAreaClass("min-h-[140px] font-sans")}
        />
      </Panel>
      <div className="flex flex-col gap-3">
        {ALGOS.map((a) => (
          <Panel key={a}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold">{a}</span>
              <CopyButton value={hashes[a] || ""} disabled={!hashes[a]} />
            </div>
            <code className="scroll-thin block overflow-x-auto whitespace-nowrap rounded-lg bg-background p-2 font-mono text-sm">
              {hashes[a] || <span className="text-muted-foreground">—</span>}
            </code>
          </Panel>
        ))}
      </div>
    </div>
  )
}
