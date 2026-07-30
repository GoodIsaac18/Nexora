import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { PdfUnlocker } from "@/components/tools/pdf-unlocker"

export const metadata: Metadata = toolMetadata("pdf-unlocker")

export default function Page() {
  return (
    <ToolShell slug="pdf-unlocker">
      <PdfUnlocker />
    </ToolShell>
  )
}
