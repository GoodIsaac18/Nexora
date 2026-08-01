import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { PdfToJpgWrapper } from "@/components/tools/pdf-to-jpg-wrapper"

export const metadata: Metadata = toolMetadata("pdf-to-jpg")

export default function Page() {
  return (
    <ToolShell slug="pdf-to-jpg">
      <PdfToJpgWrapper />
    </ToolShell>
  )
}
