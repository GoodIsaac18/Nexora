import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { MarkdownToHtml } from "@/components/tools/markdown-to-html"

export const metadata: Metadata = toolMetadata("markdown-to-html")

export default function Page() {
  return (
    <ToolShell slug="markdown-to-html">
      <MarkdownToHtml />
    </ToolShell>
  )
}
