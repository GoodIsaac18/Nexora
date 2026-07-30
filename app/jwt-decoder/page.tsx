import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { JwtDecoder } from "@/components/tools/jwt-decoder"

export const metadata: Metadata = toolMetadata("jwt-decoder")

export default function Page() {
  return (
    <ToolShell slug="jwt-decoder">
      <JwtDecoder />
    </ToolShell>
  )
}
