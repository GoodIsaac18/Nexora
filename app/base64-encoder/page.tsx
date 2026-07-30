import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { Base64Encoder } from "@/components/tools/base64-encoder"

export const metadata: Metadata = toolMetadata("base64-encoder")

export default function Page() {
  return (
    <ToolShell slug="base64-encoder">
      <Base64Encoder />
    </ToolShell>
  )
}
