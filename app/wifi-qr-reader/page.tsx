import { ToolShell } from "@/components/tool-shell"
import { WifiQrReader } from "@/components/tools/wifi-qr-reader"

export default function WifiQrReaderPage() {
  return (
    <ToolShell slug="wifi-qr-reader">
      <WifiQrReader />
    </ToolShell>
  )
}
