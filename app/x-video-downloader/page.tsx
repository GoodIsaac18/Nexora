import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { MediaDownloader } from "@/components/tools/media-downloader"

export const metadata: Metadata = toolMetadata("x-video-downloader")

export default function Page() {
  return (
    <ToolShell slug="x-video-downloader">
      <MediaDownloader 
        slug="x-video-downloader"
        placeholder="Pega el enlace de X (Twitter) aquí..."
        hint="Ejemplo: https://x.com/usuario/status/1234567890 o https://twitter.com/usuario/status/1234567890"
      />
    </ToolShell>
  )
}
