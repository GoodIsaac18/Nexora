"use client"

import { useState, useMemo } from "react"
import { Search, Check, X } from "lucide-react"
import { ActionButton, FieldLabel, Panel, inputClass, textAreaClass } from "@/components/tools/ui"

interface Match {
  match: string
  index: number
  groups: string[]
}

export function RegexTester() {
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState("g")
  const [text, setText] = useState("")
  const [error, setError] = useState<string | null>(null)

  const matches = useMemo(() => {
    if (!pattern || !text) return []
    
    try {
      setError(null)
      const regex = new RegExp(pattern, flags)
      const result: Match[] = []
      
      if (flags.includes("g")) {
        let match
        while ((match = regex.exec(text)) !== null) {
          result.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          })
          // Prevent infinite loop for zero-width matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++
          }
        }
      } else {
        const match = regex.exec(text)
        if (match) {
          result.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          })
        }
      }
      
      return result
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid regex")
      return []
    }
  }, [pattern, flags, text])

  function toggleFlag(flag: string) {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ""))
    } else {
      setFlags(flags + flag)
    }
  }

  function highlightMatches() {
    if (!pattern || matches.length === 0) return text
    
    let result = ""
    let lastIndex = 0
    
    matches.forEach(({ match, index }) => {
      result += text.slice(lastIndex, index)
      result += `<mark class="bg-green-200 dark:bg-green-900/30 rounded px-0.5">${match}</mark>`
      lastIndex = index + match.length
    })
    
    result += text.slice(lastIndex)
    return result
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <Panel>
        <FieldLabel htmlFor="pattern">Patrón Regex</FieldLabel>
        <input
          id="pattern"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="Ej: \b\w+@\w+\.\w+\b"
          className={inputClass()}
        />
        
        <div className="mt-3 flex flex-wrap gap-2">
          {["g", "i", "m", "s", "u", "y"].map((flag) => (
            <button
              key={flag}
              onClick={() => toggleFlag(flag)}
              className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                flags.includes(flag)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
              title={
                flag === "g" ? "Global - buscar todas las coincidencias" :
                flag === "i" ? "Case insensitive - ignorar mayúsculas/minúsculas" :
                flag === "m" ? "Multiline - ^ y $ coinciden con líneas" :
                flag === "s" ? "Dot matches newlines - . coincide con saltos de línea" :
                flag === "u" ? "Unicode - soporte completo Unicode" :
                flag === "y" ? "Sticky - coincidencias desde lastIndex" : ""
              }
            >
              {flag}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
            <X className="size-4" />
            {error}
          </div>
        )}
      </Panel>

      <Panel>
        <FieldLabel htmlFor="text">Texto de prueba</FieldLabel>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Pega el texto aquí para probar tu regex..."
          className={textAreaClass()}
        />
      </Panel>

      {matches.length > 0 && (
        <Panel>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium">
              {matches.length} {matches.length === 1 ? "coincidencia" : "coincidencias"} encontradas
            </h3>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="size-4" />
              Regex válido
            </div>
          </div>

          <div className="mb-4 max-h-48 overflow-y-auto rounded-lg border border-border bg-background p-4">
            <div
              className="whitespace-pre-wrap break-words text-sm"
              dangerouslySetInnerHTML={{ __html: highlightMatches() }}
            />
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Detalles de coincidencias</h4>
            <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background border-b border-border">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">#</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Coincidencia</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Posición</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Grupos</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="px-3 py-2 text-muted-foreground">{index + 1}</td>
                      <td className="px-3 py-2 font-mono">{match.match}</td>
                      <td className="px-3 py-2 text-muted-foreground">{match.index}</td>
                      <td className="px-3 py-2">
                        {match.groups.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {match.groups.map((group, i) => (
                              <span
                                key={i}
                                className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono"
                              >
                                ${i + 1}: {group || "(vacío)"}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Panel>
      )}

      {pattern && !error && matches.length === 0 && text && (
        <Panel>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <X className="size-4" />
            No se encontraron coincidencias
          </div>
        </Panel>
      )}

      <Panel>
        <h3 className="mb-2 text-sm font-medium">Referencia rápida de flags</h3>
        <div className="grid gap-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="rounded bg-muted px-2 py-0.5 font-mono">g</span>
            <span className="text-muted-foreground">Global - buscar todas las coincidencias en el texto</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="rounded bg-muted px-2 py-0.5 font-mono">i</span>
            <span className="text-muted-foreground">Case insensitive - ignorar mayúsculas/minúsculas</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="rounded bg-muted px-2 py-0.5 font-mono">m</span>
            <span className="text-muted-foreground">Multiline - ^ y $ coinciden con inicio/fin de línea</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="rounded bg-muted px-2 py-0.5 font-mono">s</span>
            <span className="text-muted-foreground">Dot matches newlines - . coincide con saltos de línea</span>
          </div>
        </div>
      </Panel>
    </div>
  )
}
