import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { LinkShortener } from "@/components/tools/link-shortener"

export const metadata: Metadata = toolMetadata("link-shortener")

export default function Page() {
  return (
    <ToolShell slug="link-shortener">
      <LinkShortener />
    </ToolShell>
  )
}
