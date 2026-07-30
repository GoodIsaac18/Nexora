import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { JpgToPdf } from "@/components/tools/jpg-to-pdf"

export const metadata: Metadata = toolMetadata("jpg-to-pdf")

export default function Page() {
  return (
    <ToolShell slug="jpg-to-pdf">
      <JpgToPdf />
    </ToolShell>
  )
}
