import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { UtmLinkBuilder } from "@/components/tools/utm-link-builder"

export const metadata: Metadata = toolMetadata("utm-link-builder")

export default function Page() {
  return (
    <ToolShell slug="utm-link-builder">
      <UtmLinkBuilder />
    </ToolShell>
  )
}
