import { ToolShell } from "@/components/tool-shell"
import { QrReader } from "@/components/tools/qr-reader"

export default function QrReaderPage() {
  return (
    <ToolShell slug="qr-reader">
      <QrReader />
    </ToolShell>
  )
}
