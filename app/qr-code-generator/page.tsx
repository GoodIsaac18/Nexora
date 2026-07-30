import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { QrCodeGenerator } from "@/components/tools/qr-code-generator"

export const metadata: Metadata = toolMetadata("qr-code-generator")

export default function Page() {
  return (
    <ToolShell slug="qr-code-generator">
      <QrCodeGenerator />
    </ToolShell>
  )
}
