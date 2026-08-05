import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { TipCalculator } from "@/components/tools/tip-calculator"

export const metadata: Metadata = toolMetadata("tip-calculator")

export default function Page() {
  return (
    <ToolShell slug="tip-calculator">
      <TipCalculator />
    </ToolShell>
  )
}
