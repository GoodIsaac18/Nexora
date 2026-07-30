import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { VideoConverter } from "@/components/tools/video-converter"

export const metadata: Metadata = toolMetadata("video-converter")

export default function Page() {
  return (
    <ToolShell slug="video-converter">
      <VideoConverter />
    </ToolShell>
  )
}
