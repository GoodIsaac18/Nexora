"use client"

import { useCallback, useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { CopyButton } from "@/components/copy-button"
import { ActionButton } from "@/components/tools/ui"

const WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(
    " ",
  )

function rand(max: number) {
  return Math.floor(Math.random() * max)
}
function sentence() {
  const len = 8 + rand(10)
  const w = Array.from({ length: len }, () => WORDS[rand(WORDS.length)])
  w[0] = w[0][0].toUpperCase() + w[0].slice(1)
  return w.join(" ") + "."
}
function paragraph() {
  const len = 3 + rand(4)
  return Array.from({ length: len }, sentence).join(" ")
}

type Unit = "paragraphs" | "sentences" | "words"

export function LoremIpsumGenerator() {
  const [unit, setUnit] = useState<Unit>("paragraphs")
  const [count, setCount] = useState(3)
  const [text, setText] = useState("")

  const generate = useCallback(() => {
    if (unit === "paragraphs") setText(Array.from({ length: count }, paragraph).join("\n\n"))
    else if (unit === "sentences") setText(Array.from({ length: count }, sentence).join(" "))
    else setText(Array.from({ length: count }, () => WORDS[rand(WORDS.length)]).join(" "))
  }, [unit, count])

  useEffect(() => {
    generate()
  }, [generate])

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium">
            Amount
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
              className="ml-2 h-9 w-20 rounded-lg border border-border bg-background px-2 text-sm"
            />
          </label>
          <div className="inline-flex rounded-lg border border-border bg-background p-1">
            {(["paragraphs", "sentences", "words"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`rounded-md px-3 py-1 text-sm capitalize transition-colors ${
                  unit === u ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <ActionButton onClick={generate}>
              <RefreshCw className="size-4" /> Generate
            </ActionButton>
            <CopyButton value={text} className="h-10 px-4" />
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <p className="scroll-thin min-h-[280px] whitespace-pre-wrap leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
