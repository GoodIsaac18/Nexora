import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { PdfToJpg } from "@/components/tools/pdf-to-jpg"

export const metadata: Metadata = toolMetadata("pdf-to-jpg")

export default function Page() {
  return (
    <ToolShell slug="pdf-to-jpg">
      <PdfToJpg />
    </ToolShell>
  )
}
