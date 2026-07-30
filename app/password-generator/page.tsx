import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { PasswordGenerator } from "@/components/tools/password-generator"

export const metadata: Metadata = toolMetadata("password-generator")

export default function Page() {
  return (
    <ToolShell slug="password-generator">
      <PasswordGenerator />
    </ToolShell>
  )
}
