import { ToolShell } from "@/components/tool-shell"
import { ImageGenerator } from "@/components/tools/image-generator"

export default function ImageGeneratorPage() {
  return <ToolShell slug="image-generator"><ImageGenerator /></ToolShell>
}
