"use client"

import { useCallback, useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { CopyButton } from "@/components/copy-button"
import { Panel } from "@/components/tools/ui"

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
}

type Options = { lower: boolean; upper: boolean; numbers: boolean; symbols: boolean }

function randomInt(max: number) {
  const arr = new Uint32Array(1)
  crypto.getRandomValues(arr)
  return arr[0] % max
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [opts, setOpts] = useState<Options>({ lower: true, upper: true, numbers: true, symbols: true })
  const [password, setPassword] = useState("")

  const generate = useCallback(() => {
    const pool = Object.entries(opts)
      .filter(([, v]) => v)
      .map(([k]) => SETS[k as keyof typeof SETS])
      .join("")
    if (!pool) {
      setPassword("")
      return
    }
    let out = ""
    for (let i = 0; i < length; i++) out += pool[randomInt(pool.length)]
    setPassword(out)
  }, [length, opts])

  useEffect(() => {
    generate()
  }, [generate])

  const activeCount = Object.values(opts).filter(Boolean).length
  const strength = Math.min(100, Math.round((length / 24) * 60 + activeCount * 10))
  const strengthLabel = strength < 40 ? "Weak" : strength < 70 ? "Good" : "Strong"
  const strengthColor =
    strength < 40 ? "bg-destructive" : strength < 70 ? "bg-chart-4" : "bg-primary"

  return (
    <div className="flex flex-col gap-4">
      <Panel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <output className="scroll-thin flex-1 overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-lg tracking-wide">
            {password || <span className="text-muted-foreground">Select at least one option</span>}
          </output>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={generate}
              aria-label="Regenerate"
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              <RefreshCw className="size-4" /> Regenerate
            </button>
            <CopyButton value={password} className="h-11 px-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Strength</span>
            <span className="font-medium">{strengthLabel}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-500 ${strengthColor}`}
              style={{ width: `${strength}%` }}
            />
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="mb-4 flex items-center justify-between">
          <label htmlFor="len" className="text-sm font-medium">
            Length
          </label>
          <span className="rounded-lg bg-muted px-2.5 py-1 font-mono text-sm">{length}</span>
        </div>
        <input
          id="len"
          type="range"
          min={4}
          max={48}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-[var(--primary)]"
        />

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["upper", "Uppercase (A-Z)"],
              ["lower", "Lowercase (a-z)"],
              ["numbers", "Numbers (0-9)"],
              ["symbols", "Symbols (!@#$)"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background p-3 transition-colors hover:bg-muted"
            >
              <input
                type="checkbox"
                checked={opts[key]}
                onChange={(e) => setOpts((o) => ({ ...o, [key]: e.target.checked }))}
                className="size-4 accent-[var(--primary)]"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </Panel>
    </div>
  )
}
