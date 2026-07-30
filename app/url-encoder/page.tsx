import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { UrlEncoder } from "@/components/tools/url-encoder"

export const metadata: Metadata = toolMetadata("url-encoder")

export default function Page() {
  return (
    <ToolShell slug="url-encoder">
      <UrlEncoder />
    </ToolShell>
  )
}
