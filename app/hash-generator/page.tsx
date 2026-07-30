import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { HashGenerator } from "@/components/tools/hash-generator"

export const metadata: Metadata = toolMetadata("hash-generator")

export default function Page() {
  return (
    <ToolShell slug="hash-generator">
      <HashGenerator />
    </ToolShell>
  )
}
