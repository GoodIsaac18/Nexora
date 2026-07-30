import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { CaseConverter } from "@/components/tools/case-converter"

export const metadata: Metadata = toolMetadata("case-converter")

export default function Page() {
  return (
    <ToolShell slug="case-converter">
      <CaseConverter />
    </ToolShell>
  )
}
