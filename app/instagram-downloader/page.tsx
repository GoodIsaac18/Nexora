import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { MediaDownloader } from "@/components/tools/media-downloader"

export const metadata: Metadata = toolMetadata("instagram-downloader")

export default function Page() {
  return (
    <ToolShell slug="instagram-downloader">
      <MediaDownloader 
        slug="instagram-downloader"
        placeholder="Pega el enlace de Instagram aquí..."
        hint="Ejemplo: https://www.instagram.com/reel/abcd1234 o https://www.instagram.com/p/abcd1234"
      />
    </ToolShell>
  )
}
