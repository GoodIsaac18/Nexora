import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { ColorPicker } from "@/components/tools/color-picker"

export const metadata: Metadata = toolMetadata("color-picker")

export default function Page() {
  return (
    <ToolShell slug="color-picker">
      <ColorPicker />
    </ToolShell>
  )
}
