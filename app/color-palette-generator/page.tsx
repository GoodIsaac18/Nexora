import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { ColorPaletteGenerator } from "@/components/tools/color-palette-generator"

export const metadata: Metadata = toolMetadata("color-palette-generator")

export default function Page() {
  return (
    <ToolShell slug="color-palette-generator">
      <ColorPaletteGenerator />
    </ToolShell>
  )
}
