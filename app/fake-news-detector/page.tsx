import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { FakeNewsDetector } from "@/components/tools/fake-news-detector"

export const metadata: Metadata = toolMetadata("fake-news-detector")

export default function Page() {
  return (
    <ToolShell slug="fake-news-detector">
      <FakeNewsDetector />
    </ToolShell>
  )
}
