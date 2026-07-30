import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { PdfSplitter } from "@/components/tools/pdf-splitter"

export const metadata: Metadata = toolMetadata("pdf-splitter")

export default function Page() {
  return (
    <ToolShell slug="pdf-splitter">
      <PdfSplitter />
    </ToolShell>
  )
}
