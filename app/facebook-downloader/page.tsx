import type { Metadata } from "next"
import { toolMetadata } from "@/lib/tools"
import { ToolShell } from "@/components/tool-shell"
import { MediaDownloader } from "@/components/tools/media-downloader"

export const metadata: Metadata = toolMetadata("facebook-downloader")

export default function Page() {
  return (
    <ToolShell slug="facebook-downloader">
      <MediaDownloader 
        slug="facebook-downloader"
        placeholder="Pega el enlace de Facebook aquí..."
        hint="Ejemplo: https://www.facebook.com/watch?v=1234567890 o https://fb.watch/abcd1234"
      />
    </ToolShell>
  )
}
