import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { MetaTagGenerator } from "@/components/tools/meta-tag-generator"

export const metadata: Metadata = toolMetadata("meta-tag-generator")

export default function Page() {
  return (
    <ToolShell slug="meta-tag-generator">
      <MetaTagGenerator />
    </ToolShell>
  )
}
