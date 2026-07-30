"use client"

import { useState } from "react"
import { GitCompare, RefreshCw } from "lucide-react"
import { ActionButton, FieldLabel, Panel, inputClass } from "@/components/tools/ui"

interface DiffLine {
  line: string
  type: "added" | "removed" | "unchanged"
  lineNumber: number
}

export function DiffChecker() {
  const [text1, setText1] = useState("")
  const [text2, setText2] = useState("")
  const [diff, setDiff] = useState<DiffLine[]>([])
  const [hasChanges, setHasChanges] = useState(false)

  function computeDiff() {
    const lines1 = text1.split("\n")
    const lines2 = text2.split("\n")
    const result: DiffLine[] = []
    
    let i = 0, j = 0
    let lineNum = 1

    while (i < lines1.length || j < lines2.length) {
      if (i < lines1.length && j < lines2.length && lines1[i] === lines2[j]) {
        result.push({ line: lines1[i], type: "unchanged", lineNumber: lineNum })
        i++
        j++
        lineNum++
      } else if (i < lines1.length && (j >= lines2.length || lines1[i] !== lines2[j])) {
        result.push({ line: lines1[i], type: "removed", lineNumber: lineNum })
        i++
      } else if (j < lines2.length && (i >= lines1.length || lines1[i] !== lines2[j])) {
        result.push({ line: lines2[j], type: "added", lineNumber: lineNum })
        j++
        lineNum++
      }
    }

    setDiff(result)
    setHasChanges(result.some(d => d.type !== "unchanged"))
  }

  function clearAll() {
    setText1("")
    setText2("")
    setDiff([])
    setHasChanges(false)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Panel>
          <FieldLabel htmlFor="text1">Texto original</FieldLabel>
          <textarea
            id="text1"
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Pega el texto original aquí..."
            className="min-h-[300px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </Panel>

        <Panel>
          <FieldLabel htmlFor="text2">Texto modificado</FieldLabel>
          <textarea
            id="text2"
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Pega el texto modificado aquí..."
            className="min-h-[300px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </Panel>
      </div>

      <div className="flex gap-2">
        <ActionButton onClick={computeDiff} disabled={!text1 || !text2}>
          <GitCompare className="size-4" />
          Comparar
        </ActionButton>
        <ActionButton onClick={clearAll} variant="outline">
          <RefreshCw className="size-4" />
          Limpiar
        </ActionButton>
      </div>

      {diff.length > 0 && (
        <Panel>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium">Resultado de la comparación</h3>
            {hasChanges ? (
              <span className="text-xs text-green-600">Se encontraron diferencias</span>
            ) : (
              <span className="text-xs text-muted-foreground">Sin diferencias</span>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto rounded-lg border border-border bg-background">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Línea</th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Contenido</th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Estado</th>
                </tr>
              </thead>
              <tbody>
                {diff.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b border-border ${
                      item.type === "added" ? "bg-green-50 dark:bg-green-950/20" :
                      item.type === "removed" ? "bg-red-50 dark:bg-red-950/20" :
                      ""
                    }`}
                  >
                    <td className="px-3 py-2 text-muted-foreground">{item.lineNumber}</td>
                    <td className="px-3 py-2 font-mono">{item.line || "(vacío)"}</td>
                    <td className="px-3 py-2">
                      {item.type === "added" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                          + Agregado
                        </span>
                      )}
                      {item.type === "removed" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-100">
                          - Eliminado
                        </span>
                      )}
                      {item.type === "unchanged" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                          Sin cambios
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-green-100 dark:bg-green-950/20" />
              <span>Agregado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-red-100 dark:bg-red-950/20" />
              <span>Eliminado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-gray-100 dark:bg-gray-800" />
              <span>Sin cambios</span>
            </div>
          </div>
        </Panel>
      )}
    </div>
  )
}
