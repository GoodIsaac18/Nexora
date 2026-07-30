import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { MediaDownloader } from "@/components/tools/media-downloader"

export const metadata: Metadata = toolMetadata("tiktok-downloader")

export default function Page() {
  return (
    <ToolShell slug="tiktok-downloader">
      <MediaDownloader 
        slug="tiktok-downloader"
        placeholder="Pega el enlace de TikTok aquí..."
        hint="Ejemplo: https://www.tiktok.com/@usuario/video/1234567890"
      />
    </ToolShell>
  )
}
