import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { WhatsappLinkGenerator } from "@/components/tools/whatsapp-link-generator"

export const metadata: Metadata = toolMetadata("whatsapp-link-generator")

export default function Page() {
  return (
    <ToolShell slug="whatsapp-link-generator">
      <WhatsappLinkGenerator />
    </ToolShell>
  )
}
