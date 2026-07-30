import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { PdfMerger } from "@/components/tools/pdf-merger"

export const metadata: Metadata = toolMetadata("pdf-merger")

export default function Page() {
  return (
    <ToolShell slug="pdf-merger">
      <PdfMerger />
    </ToolShell>
  )
}
