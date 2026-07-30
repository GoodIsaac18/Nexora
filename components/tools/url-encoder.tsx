"use client"

import { useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { FieldLabel, Panel, textAreaClass } from "@/components/tools/ui"

export function UrlEncoder() {
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [input, setInput] = useState("")

  let output = ""
  try {
    output = mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input)
  } catch {
    output = "⚠ Invalid input"
  }

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
        <Panel>
          <FieldLabel htmlFor="url-in">Input</FieldLabel>
          <textarea
            id="url-in"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "https://example.com/?q=hello world" : "https%3A%2F%2Fexample.com"}
            spellCheck={false}
            className={textAreaClass("min-h-[200px]")}
          />
        </Panel>
        <Panel>
          <div className="mb-2 flex items-center justify-between">
            <FieldLabel>Output</FieldLabel>
            <CopyButton value={output} />
          </div>
          <pre className="scroll-thin min-h-[200px] overflow-auto whitespace-pre-wrap break-all rounded-xl border border-border bg-background p-3 font-mono text-sm leading-relaxed">
            {output || <span className="text-muted-foreground">Output appears here…</span>}
          </pre>
        </Panel>
      </div>
    </div>
  )
}
