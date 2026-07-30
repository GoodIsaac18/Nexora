import { ToolShell } from "@/components/tool-shell"
import { SqlFormatter } from "@/components/tools/sql-formatter"

export default function SqlFormatterPage() {
  return <ToolShell slug="sql-formatter"><SqlFormatter /></ToolShell>
}
