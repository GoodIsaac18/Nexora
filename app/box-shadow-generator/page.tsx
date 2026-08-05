import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { BoxShadowGenerator } from "@/components/tools/box-shadow-generator"

export const metadata: Metadata = toolMetadata("box-shadow-generator")

export default function Page() {
  return (
    <ToolShell slug="box-shadow-generator">
      <BoxShadowGenerator />
    </ToolShell>
  )
}
