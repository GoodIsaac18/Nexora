import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { UuidGenerator } from "@/components/tools/uuid-generator"

export const metadata: Metadata = toolMetadata("uuid-generator")

export default function Page() {
  return (
    <ToolShell slug="uuid-generator">
      <UuidGenerator />
    </ToolShell>
  )
}
