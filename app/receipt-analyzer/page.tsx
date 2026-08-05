import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { ReceiptAnalyzer } from "@/components/tools/receipt-analyzer"

export const metadata: Metadata = toolMetadata("receipt-analyzer")

export default function Page() {
  return (
    <ToolShell slug="receipt-analyzer">
      <ReceiptAnalyzer />
    </ToolShell>
  )
}
