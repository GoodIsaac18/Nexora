"use client"

import { useCallback, useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { CopyButton } from "@/components/copy-button"
import { ActionButton } from "@/components/tools/ui"

function uuid() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID()
  // fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function UuidGenerator() {
  const [count, setCount] = useState(5)
  const [uppercase, setUppercase] = useState(false)
  const [list, setList] = useState<string[]>([])

  const generate = useCallback(() => {
    setList(Array.from({ length: count }, () => uuid()))
  }, [count])

  useEffect(() => {
    generate()
  }, [generate])

  const display = (v: string) => (uppercase ? v.toUpperCase() : v)
  const allText = list.map(display).join("\n")

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium">
            Quantity
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
              className="ml-2 h-9 w-20 rounded-lg border border-border bg-background px-2 text-sm"
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="size-4 accent-[var(--primary)]"
            />
            Uppercase
          </label>
          <div className="ml-auto flex gap-2">
            <ActionButton onClick={generate}>
              <RefreshCw className="size-4" /> Generate
            </ActionButton>
            <CopyButton value={allText} label="Copy all" className="h-10 px-4" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <ul className="flex flex-col gap-2">
          {list.map((v, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2"
            >
              <code className="scroll-thin overflow-x-auto font-mono text-sm">{display(v)}</code>
              <CopyButton value={display(v)} label="" className="shrink-0 px-2" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
