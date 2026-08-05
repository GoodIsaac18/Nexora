import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { ColorContrastChecker } from "@/components/tools/color-contrast-checker"

export const metadata: Metadata = toolMetadata("color-contrast-checker")

export default function Page() {
  return (
    <ToolShell slug="color-contrast-checker">
      <ColorContrastChecker />
    </ToolShell>
  )
}
