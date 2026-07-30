import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { PdfCompressor } from "@/components/tools/pdf-compressor"

export const metadata: Metadata = toolMetadata("pdf-compressor")

export default function Page() {
  return (
    <ToolShell slug="pdf-compressor">
      <PdfCompressor />
    </ToolShell>
  )
}
