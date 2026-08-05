import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { BusinessNameGenerator } from "@/components/tools/business-name-generator"

export const metadata: Metadata = toolMetadata("business-name-generator")

export default function Page() {
  return (
    <ToolShell slug="business-name-generator">
      <BusinessNameGenerator />
    </ToolShell>
  )
}
