import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { TimestampConverter } from "@/components/tools/timestamp-converter"

export const metadata: Metadata = toolMetadata("timestamp-converter")

export default function Page() {
  return (
    <ToolShell slug="timestamp-converter">
      <TimestampConverter />
    </ToolShell>
  )
}
