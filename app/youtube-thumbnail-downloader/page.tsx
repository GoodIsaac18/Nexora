import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { YoutubeThumbnailDownloader } from "@/components/tools/youtube-thumbnail-downloader"

export const metadata: Metadata = toolMetadata("youtube-thumbnail-downloader")

export default function Page() {
  return (
    <ToolShell slug="youtube-thumbnail-downloader">
      <YoutubeThumbnailDownloader />
    </ToolShell>
  )
}
