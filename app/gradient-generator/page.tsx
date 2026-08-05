import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { GradientGenerator } from "@/components/tools/gradient-generator"

export const metadata: Metadata = toolMetadata("gradient-generator")

export default function Page() {
  return (
    <ToolShell slug="gradient-generator">
      <GradientGenerator />
    </ToolShell>
  )
}
