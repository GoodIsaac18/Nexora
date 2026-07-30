import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { JsonFormatter } from "@/components/tools/json-formatter"

export const metadata: Metadata = toolMetadata("json-formatter")

export default function Page() {
  return (
    <ToolShell slug="json-formatter">
      <JsonFormatter />
    </ToolShell>
  )
}
