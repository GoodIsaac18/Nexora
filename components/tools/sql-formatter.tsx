"use client"

import { useState } from "react"
import { Database, Copy } from "lucide-react"
import { ActionButton, FieldLabel, Panel, inputClass, textAreaClass } from "@/components/tools/ui"
import { CopyButton } from "@/components/copy-button"

export function SqlFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [indentation, setIndentation] = useState(2)

  function formatSQL(sql: string): string {
    if (!sql.trim()) return ""

    let formatted = ""
    let indentLevel = 0
    const indent = " ".repeat(indentation)
    
    const keywords = [
      "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "IN", "IS", "NULL",
      "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "ON",
      "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET",
      "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
      "CREATE TABLE", "ALTER TABLE", "DROP TABLE",
      "UNION", "UNION ALL", "INTERSECT", "EXCEPT",
      "CASE", "WHEN", "THEN", "ELSE", "END",
      "AS", "DISTINCT", "ALL", "EXISTS", "BETWEEN", "LIKE"
    ]

    // Split by common delimiters while preserving them
    const tokens = sql.split(/(\s+|,|\(|\)|;|=|<>|!=|>=|<=|>|<)/g).filter(t => t.trim())

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i].trim().toUpperCase()
      const originalToken = tokens[i]

      if (!token) continue

      // Check if it's a keyword
      if (keywords.includes(token)) {
        // Add newline before most keywords
        if (["SELECT", "FROM", "WHERE", "AND", "OR", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "ON", "UNION", "UNION ALL"].includes(token)) {
          formatted += "\n" + indent.repeat(indentLevel)
        }
        
        formatted += token + " "
        
        // Increase indent after certain keywords
        if (["SELECT", "FROM", "WHERE", "CASE", "WHEN"].includes(token)) {
          indentLevel++
        }
        
        // Decrease indent before certain keywords
        if (["AND", "OR", "WHEN", "THEN", "ELSE", "END"].includes(token) && indentLevel > 0) {
          indentLevel--
        }
      } else if (originalToken === "(") {
        formatted += "(\n" + indent.repeat(indentLevel + 1)
        indentLevel++
      } else if (originalToken === ")") {
        indentLevel = Math.max(0, indentLevel - 1)
        formatted += "\n" + indent.repeat(indentLevel) + ")"
      } else if (originalToken === ",") {
        formatted += ",\n" + indent.repeat(indentLevel)
      } else if (originalToken === ";") {
        formatted += ";\n"
        indentLevel = 0
      } else if (["=", "<>", "!=", ">=", "<=", ">", "<"].includes(originalToken)) {
        formatted += " " + originalToken + " "
      } else {
        formatted += originalToken + " "
      }
    }

    // Clean up extra whitespace
    formatted = formatted.replace(/\s+/g, " ").replace(/,\s/g, ",\n").replace(/\(\s/g, "(\n").replace(/\s\)/g, "\n)")
    
    // Better formatting
    const lines = formatted.split("\n")
    const betterLines: string[] = []
    let currentIndent = 0

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      const upperTrimmed = trimmed.toUpperCase()
      
      // Decrease indent before closing keywords
      if (["AND", "OR", "WHERE", "ON", "GROUP BY", "ORDER BY", "HAVING", "LIMIT"].some(k => upperTrimmed.startsWith(k))) {
        currentIndent = Math.max(0, currentIndent - 1)
      }

      betterLines.push(indent.repeat(currentIndent) + trimmed)

      // Increase indent after opening keywords
      if (["SELECT", "FROM", "WHERE", "CASE", "WHEN", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN"].some(k => upperTrimmed.startsWith(k))) {
        currentIndent++
      }
    }

    return betterLines.join("\n")
  }

  function handleFormat() {
    const formatted = formatSQL(input)
    setOutput(formatted)
  }

  function handleClear() {
    setInput("")
    setOutput("")
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <Panel>
        <div className="mb-4">
          <FieldLabel htmlFor="indentation">Indentación: {indentation} espacios</FieldLabel>
          <input
            id="indentation"
            type="range"
            min="2"
            max="8"
            step="1"
            value={indentation}
            onChange={(e) => setIndentation(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <FieldLabel htmlFor="sql-input">SQL sin formatear</FieldLabel>
        <textarea
          id="sql-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pega tu consulta SQL aquí..."
          className={textAreaClass()}
        />

        <div className="mt-4 flex gap-2">
          <ActionButton onClick={handleFormat} disabled={!input.trim()}>
            <Database className="size-4" />
            Formatear SQL
          </ActionButton>
          <ActionButton onClick={handleClear} variant="outline">
            Limpiar
          </ActionButton>
        </div>
      </Panel>

      {output && (
        <Panel>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium">SQL formateado</h3>
            <CopyButton value={output} />
          </div>

          <textarea
            value={output}
            readOnly
            className={textAreaClass()}
          />
        </Panel>
      )}

      <Panel>
        <h3 className="mb-2 text-sm font-medium">Ejemplo de uso</h3>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
          <code>{`-- Antes:
SELECT u.name, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.active = true GROUP BY u.name HAVING COUNT(o.id) > 5 ORDER BY order_count DESC LIMIT 10;

-- Después:
SELECT 
  u.name, 
  COUNT(o.id) as order_count 
FROM users u 
LEFT JOIN orders o ON u.id = o.user_id 
WHERE u.active = true 
GROUP BY u.name 
HAVING COUNT(o.id) > 5 
ORDER BY order_count DESC 
LIMIT 10;`}</code>
        </pre>
      </Panel>
    </div>
  )
}
