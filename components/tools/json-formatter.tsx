"use client"

import { useMemo, useState } from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { CopyButton } from "@/components/copy-button"
import { ActionButton, FieldLabel } from "@/components/tools/ui"

const SAMPLE = `{"name":"Toolbox","tools":["json","uuid"],"active":true,"count":300}`

export function JsonFormatter() {
  const [input, setInput] = useState("")
  const [indent, setIndent] = useState(2)

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: "", error: "" }
    try {
      const parsed = JSON.parse(input)
      return { ok: true as const, output: JSON.stringify(parsed, null, indent), error: "" }
    } catch (e) {
      return { ok: false as const, output: "", error: (e as Error).message }
    }
  }, [input, indent])

  function minify() {
    try {
      setInput(JSON.stringify(JSON.parse(input)))
    } catch {}
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <FieldLabel htmlFor="json-input">Input JSON</FieldLabel>
          <div className="flex gap-2">
            <ActionButton variant="outline" onClick={() => setInput(SAMPLE)}>
              Sample
            </ActionButton>
            <ActionButton variant="outline" onClick={() => setInput("")}>
              Clear
            </ActionButton>
          </div>
        </div>
        <textarea
          id="json-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JSON here…"
          spellCheck={false}
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[200px] font-mono"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="text-sm text-muted-foreground">
            Indent:
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="ml-2 rounded-lg border border-border bg-background px-2 py-1 text-sm"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={0}>Tab</option>
            </select>
          </label>
          <ActionButton variant="outline" onClick={minify}>
            Minify
          </ActionButton>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Formatted output</span>
          <CopyButton value={result.output} />
        </div>
        {result.ok ? (
          <>
            <pre className="scroll-thin min-h-[320px] overflow-auto rounded-xl border border-border bg-background p-3 font-mono text-sm leading-relaxed">
              {result.output || <span className="text-muted-foreground">Output appears here…</span>}
            </pre>
            {input.trim() && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary">
                <CheckCircle2 className="size-4" /> Valid JSON
              </p>
            )}
          </>
        ) : (
          <div className="flex min-h-[320px] flex-col rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <p className="inline-flex items-center gap-1.5 font-medium text-destructive">
              <AlertCircle className="size-4" /> Invalid JSON
            </p>
            <p className="mt-2 font-mono text-sm text-destructive/90">{result.error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
