import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { WordCounter } from "@/components/tools/word-counter"

export const metadata: Metadata = toolMetadata("word-counter")

export default function Page() {
  return (
    <ToolShell slug="word-counter">
      <WordCounter />
    </ToolShell>
  )
}
