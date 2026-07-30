import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { MediaDownloader } from "@/components/tools/media-downloader"

export const metadata: Metadata = toolMetadata("youtube-downloader")

export default function Page() {
  return (
    <ToolShell slug="youtube-downloader">
      <MediaDownloader 
        slug="youtube-downloader"
        placeholder="Pega el enlace de YouTube aquí..."
        hint="Ejemplo: https://www.youtube.com/watch?v=abcd1234 o https://youtu.be/abcd1234"
      />
    </ToolShell>
  )
}
