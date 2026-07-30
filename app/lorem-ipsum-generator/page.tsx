import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { LoremIpsumGenerator } from "@/components/tools/lorem-ipsum-generator"

export const metadata: Metadata = toolMetadata("lorem-ipsum-generator")

export default function Page() {
  return (
    <ToolShell slug="lorem-ipsum-generator">
      <LoremIpsumGenerator />
    </ToolShell>
  )
}
