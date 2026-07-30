import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { UnitConverter } from "@/components/tools/unit-converter"

export const metadata: Metadata = toolMetadata("unit-converter")

export default function Page() {
  return (
    <ToolShell slug="unit-converter">
      <UnitConverter />
    </ToolShell>
  )
}
